import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { UserInfo } from '@challenge90days/api-interfaces';
import { BehaviorSubject } from 'rxjs';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import firebase from 'firebase';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$ = new BehaviorSubject<any>({});
  userId$ = new BehaviorSubject<string>('');
  userInfo$ = new BehaviorSubject<UserInfo>(null);
  userCollection: AngularFirestoreCollection<UserInfo>;

  constructor(
    private firestore: AngularFirestore,
    private authService: NbAuthService
  ) {
    this.getUserInfoByToken();
  }

  getUserInfoByToken() {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      const userInfo = token.getPayload();
      this.userId$.next(userInfo.user_id);
      if (token.isValid()) {
        console.log(userInfo);
        this.user$.next(userInfo);
        this.getUserInfo(userInfo.user_id);
      }
    });
  }

  getUserInfo(userId: string): void {
    console.log('get user info');
    this.userCollection = this.firestore.collection<UserInfo>('user', (ref) => {
      return ref.where('userId', '==', userId);
    });

    this.userCollection.get().subscribe((e) => {
      console.log(e);
      console.log(e.metadata);
    });
    this.userCollection.snapshotChanges().subscribe((e) => {
      console.log(e);
    });
    this.userCollection.ref.get().then((e) => console.log(e));
    this.userCollection.valueChanges().subscribe((userInfo) => {
      console.log(userInfo);
      this.userInfo$.next(userInfo[0]);
      console.log(this.userInfo$.value);
      // this.updateUserInfo()
    });
  }

  updateUserInfo(checkinPath: string): void {
    console.log('333');
    console.log(this.userInfo$.value.userId);
    this.firestore
      .collection('user')
      .doc(this.userInfo$.value.userId)
      .update({
        checkinList: firebase.firestore.FieldValue.arrayUnion(
          this.firestore.doc(checkinPath).ref
        ),
      });
  }

  updateUserId(userId: string): void {
    this.userId$.next(userId);
  }
}
