import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, BehaviorSubject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';
import { UserService } from './user.service';
import { UserInfo } from '@challenge90days/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class CheckinService {
  checkinCollection: AngularFirestoreCollection<any>;
  //
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  userInfo
  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private userService: UserService,
  ) {
    this.checkinCollection = firestore.collection<any>('checkin');
  this.userService.userInfo$.subscribe(e=>{
    this.userInfo=e
    console.log(this.userInfo)
  })
  }

  addCheckin(checkinObj: any): Observable<any> {
   console.log(this.userInfo)
    const data = {
      content: checkinObj.message,
      postUser: this.userInfo.name,
      url: checkinObj.url,
      imgFile: '',
      type: 1,
      time: new Date(),
      userId: this.userService.userId$.value,
      emoji:checkinObj.emoji
    };
    console.log(data)
    this.checkinCollection.add(data).then((e) => {
      console.log(e)
      if (checkinObj.imgFile) {
        this.uploadFile(checkinObj.imgFile, e.id, e.path);
      }
    });
    // TODO:可以加入名字了
    return this.http.post(
      'https://challenge-90-days.herokuapp.com/api/checkin',
      { message: checkinObj.message, name: this.userInfo.name }
    );
  }

  uploadFile(data, filePath: string, postPath: string) {
    const fullFilePath = `checkin/${filePath}`;
    const fileRef = this.storage.ref(fullFilePath);
    const task = this.storage.upload(fullFilePath, data);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(e => {
      console.log(e)
    })
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
}
