import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, BehaviorSubject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';
import { UserService } from './user.service';
import { UserInfo } from '@challenge90days/api-interfaces';
import { NbDateService } from '@nebular/theme';

@Injectable({
  providedIn: 'root',
})
export class CheckinService {
  private userDoc: AngularFirestoreDocument<any>;
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
    private userService: UserService
  ) // private dateService: NbDateService<Date>
  {
    this.checkinCollection = firestore.collection<any>('checkin');
    this.userInfo = this.userService.userInfo$.value;
  }

  test() {
    // TODO:黑人問號中
    const userPath = `user/CEd7QmQl0fQ0oJL4VcpUFH08q4u1`;
    console.log(userPath);
    this.userDoc = this.firestore.doc<any>('user/CEd7QmQl0fQ0oJL4VcpUFH08q4u1');
    this.userDoc.valueChanges().subscribe((e) => {
      console.log('user doc');
      console.log(e);
    });
    console.log(this.userInfo);
    console.log(this.userService.userId$.value);
    this.userCollection = this.firestore.collection<UserInfo>('user', (ref) => {
      // return ref.where('userId', '==', 'CEd7QmQl0fQ0oJL4VcpUFH08q4u1');
      return ref;
    });
    const a = this.userCollection.doc('CEd7QmQl0fQ0oJL4VcpUFH08q4u1');

    this.userCollection.valueChanges().subscribe((e) => {
      console.log(e);
    });
  }

  addCheckin(checkinObj: any): Observable<any> {
    // this.dateService.today()
    const data = {
      content: checkinObj.message,
      postUser: this.userInfo.name,
      url: checkinObj.url,
      imgFile: '',
      type: 1,
      time: new Date(),
      userId: this.userService.userId$.value,
    };
    // this.checkinCollection.ref.
    this.checkinCollection.add(data).then((e) => {
      console.log(e);
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
}
