import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { finalize, map } from 'rxjs/operators';
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
  downloadURL: Observable<string>;
  userInfo;
  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private userService: UserService,
    private dateService: DateService
  ) {
    this.checkinCollection = firestore.collection<any>('checkin');
    // this.userCollection = firestore.collection<any>('user');
    this.userService.userInfo$.subscribe((e) => {
      this.userInfo = e;
      console.log(this.userInfo);
    });
  }

  deleteCheckin() {}
  addCheckin(checkinObj: CheckinObj): Observable<any> {
    console.log(this.userInfo);
    const data = {
      content: checkinObj.message,
      postUser: this.userInfo.name,
      url: checkinObj.url,
      imgFile: '',
      type: 1,
      time: checkinObj.isCheckinTomorrow
        ? this.dateService.getTomorrowDateTime()
        : new Date(),
      userId: this.userService.userId$.value,
      emoji: checkinObj.emoji,
    };
    console.log(data);
    this.checkinCollection.add(data).then((e) => {
      console.log(e);
      console.log(e.path);
      this.userService.updateUserCheckinInfo(e.path);
      if (checkinObj.imgFile) {
        this.uploadFile(checkinObj.imgFile, e.id, e.path);
      }
    });

    // TODO:可以加入名字了
    return this.http.post(
      'https://challenge-90-days.herokuapp.com/api/snedMessageToLineChannel',
      { message: checkinObj.message, name: this.userInfo.name }
    );
  }

  uploadFile(data, filePath: string, postPath: string) {
    const fullFilePath = `checkin/${filePath}`;
    const fileRef = this.storage.ref(fullFilePath);
    const task = this.storage.upload(fullFilePath, data);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe((e) => {
      console.log(e);
    });
    // get notified when the download URL is available
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          console.log('final');
          console.log(this.downloadURL);
          this.downloadURL.subscribe((imgFile) => {
            console.log('download url');
            console.log(imgFile);
            this.firestore.doc(postPath).update({ imgFile });
          });
        })
      )
      .subscribe();
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
    return this.firestore.collection<Checkin>('checkin', (ref) => {
      return ref
        .where('userId', '==', this.userService.userId$.value)
        .orderBy('time', 'desc')
        .limit(1);
    }).get()
  }

  getCheckinStatus(): Observable<boolean> {
    return this.firestore
      .collection('checkin', (ref) => {
        return ref.where('userId', '==', this.userService.userId$.value);
      })
      .snapshotChanges()
      .pipe(map((e) => e.length > 0));
  }
}
