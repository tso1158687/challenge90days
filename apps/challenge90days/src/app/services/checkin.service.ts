import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CheckinService {
  checkinCollection: AngularFirestoreCollection<any>;
  //
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.checkinCollection = firestore.collection<any>('checkin');
    //test
    this.http
      .get('https://challenge-90-days.herokuapp.com/api/hello')
      .subscribe((e) => {
        console.log(e);
      });
  }

  addCheckin(checkinObj: any): Observable<any> {
    const data = {
      content: checkinObj.message,
      postUser: 'test',
      imgFile: '',
      type: 1,
      time: new Date(),
    };
    if (checkinObj.imgFile) {
      console.log('有圖片');
    }
    this.checkinCollection.add(data).then((e) => {
      this.uploadFile(checkinObj.imgFile, e.id, e.path);
    });
    return this.http.post(
      'https://challenge-90-days.herokuapp.com/api/checkin',
      { message: checkinObj.message }
    );
  }

  uploadFile(data, filePath: string, postPath: string) {
    console.log(data)
    const fullFilePath = `intro/${filePath}.jpg`;
    console.log(fullFilePath)
    const fileRef = this.storage.ref(fullFilePath);
    const task = this.storage.upload(fullFilePath, data);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
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
