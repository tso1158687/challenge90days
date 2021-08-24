import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, from, Observable, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { finalize, map, tap, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';

import { DateService } from './date.service';
import { Checkin, CheckinObj, UserInfo } from '@challenge90days/api-interfaces';
import firebase from 'firebase/app';
@Injectable({
  providedIn: 'root',
})
export class CheckinService {
  checkinCollection: AngularFirestoreCollection<any>;
  userCollection: AngularFirestoreCollection<any>;
  //
  uploadPercent: Observable<number>;

  userInfo;
  apiUrl = 'https://challenge-90-days.herokuapp.com/api';

  // date
  startOfToday = this.dateService.startOfToday;
  endOfToday = this.dateService.endOfToday;
  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private userService: UserService,
    private dateService: DateService
  ) {
    this.checkinCollection = firestore.collection<any>('checkin');
    this.userService.userInfo$.subscribe((e) => {
      this.userInfo = e;
      console.log(this.userInfo);
    });
  }

  addCheckin(checkinObj: CheckinObj): Observable<any> {
    const data = {
      content: checkinObj.message,
      postUser: this.userInfo.name,
      url: checkinObj.url,
      imgFile: [],
      type: 1,
      time: checkinObj.isCheckinTomorrow
        ? this.dateService.getTomorrowDateTimePlusOne()
        : new Date(),
      userId: this.userService.userId$.value,
      emoji: checkinObj.emoji,
      docPath: '',
    };
    const addDoc$ = from(this.checkinCollection.add(data));
    return addDoc$.pipe(
      switchMap((res) =>
        this.uploadFile(
          checkinObj.imgFile,
          res.id,
          res.path,
          checkinObj.message,
          this.userInfo.name
        )
      )
    );
  }

  getDayOff(): Observable<any> {
    const data = {
      type: 2,
      time: new Date(),
      userId: this.userService.userId$.value,
    };
    return from(this.checkinCollection.add(data));
    // .pipe(
    //   switchMap((res) => this.sendDayoffMessageToLineChatbot())
    // );
  }

  uploadFile(
    imageFiles: File[],
    filePath: string,
    docPath: string,
    message: string,
    name: string
  ): Observable<any> {
    const fullFilePath = `checkin/${filePath}`;
    for (const [i, imageFile] of Object.entries(imageFiles)) {
      const task = this.storage.upload(`${fullFilePath}${i}`, imageFile);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            const fileRef = this.storage.ref(`${fullFilePath}${i}`);
            const downloadURL$ = fileRef.getDownloadURL();
            downloadURL$.subscribe((imageUrl) => {
              console.log('download url');
              console.log(i);
              console.log(imageUrl);
              if (Number(i) === 0) {
                console.log('傳訊息');
                this.sendMessageToLineChatbot(
                  message,
                  name,
                  imageUrl,
                  filePath
                );
              }
              this.firestore.doc(docPath).update({
                imgFile: firebase.firestore.FieldValue.arrayUnion(imageUrl),
                docPath: filePath,
              });
            });
          })
        )
        .subscribe();
    }

    return of(['success']);
  }

  getLastCheckin(): Observable<Checkin[]> {
    return this.firestore
      .collection<Checkin>('checkin', (ref) => {
        return ref
          .where('userId', '==', this.userService.userId$.value)
          .orderBy('time', 'desc')
          .limit(1);
      })
      .valueChanges();
  }

  getLastCheckinRef() {
    return this.firestore
      .collection<Checkin>('checkin', (ref) => {
        return ref
          .where('userId', '==', this.userService.userId$.value)
          .orderBy('time', 'desc')
          .limit(1);
      })
      .get();
  }

  getCheckinStatus(): Observable<boolean> {
    return this.firestore
      .collection('checkin', (ref) => {
        return ref
          .where('userId', '==', this.userService.userId$.value)
          .where('time', '>', this.startOfToday)
          .where('time', '<', this.endOfToday);
      })
      .snapshotChanges()
      .pipe(map((e) => e.length > 0));
  }

  sendMessageToLineChatbot(
    message: string,
    name: string,
    imageUrl: string,
    docPath: string
  ): void {
    const url = `${this.apiUrl}/snedMessageToLineChannel`;
    this.http
      .post(url, {
        message,
        name,
        imageUrl,
        docPath,
      })
      .subscribe((e) => {
        console.log(e);
      });
  }

  sendDayoffMessageToLineChatbot(): Observable<any> {
    const url = `${this.apiUrl}/snedDayoffMessageToLineChannel`;
    return this.http.post(url, {
      name: this.userInfo.name,
    });
  }
}
