import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, from, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { finalize, map, tap, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';

import { DateService } from './date.service';
import { Checkin, CheckinObj, UserInfo } from '@challenge90days/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class CheckinService {
  checkinCollection: AngularFirestoreCollection<any>;
  userCollection: AngularFirestoreCollection<any>;
  //
  uploadPercent: Observable<number>;
  downloadURL$: Observable<string>;
  imageUrl: string;
  userInfo;
  apiUrl =
    'https://challenge-90-days.herokuapp.com/api/snedMessageToLineChannel';

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

  deleteCheckin() {}
  addCheckin(checkinObj: CheckinObj): Observable<any> {
    const data = {
      content: checkinObj.message,
      postUser: this.userInfo.name,
      url: checkinObj.url,
      imgFile: null,
      type: 1,
      time: checkinObj.isCheckinTomorrow
        ? this.dateService.getTomorrowDateTime()
        : new Date(),
      userId: this.userService.userId$.value,
      emoji: checkinObj.emoji,
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

  uploadFile(
    data,
    filePath: string,
    docPath: string,
    message: string,
    name: string
  ): Observable<any> {
    if (!data) {
      return EMPTY;
    }
    const fullFilePath = `checkin/${filePath}`;
    const fileRef = this.storage.ref(fullFilePath);
    const task = this.storage.upload(fullFilePath, data);

    // // observe percentage changes
    // this.uploadPercent = task.percentageChanges();
    // this.uploadPercent.subscribe((e) => {
    //   console.log(e);
    // });
    // get notified when the download URL is available
    return task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL$ = fileRef.getDownloadURL();
        console.log('final');
        console.log(this.downloadURL$);
        this.downloadURL$.subscribe((imageUrl) => {
          console.log('download url');
          console.log(imageUrl);
          this.imageUrl = imageUrl;
          this.firestore
            .doc(docPath)
            .update({ imgFile: imageUrl, docPath: filePath });
          this.sendMessageToLineChatbot(message, name, imageUrl, filePath);
        });
      })
    );
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
      .pipe(
        tap((e) => {
          console.log('我看看');
          console.log(e);
        }),
        map((e) => e.length > 0)
      );
  }

  sendMessageToLineChatbot(
    message: string,
    name: string,
    imageUrl: string,
    docPath: string
  ): void {
    console.log(message, name, imageUrl);
    this.http
      .post(this.apiUrl, {
        message,
        name,
        imageUrl,
        docPath,
      })
      .subscribe((e) => {
        console.log(e);
      });
  }
}
