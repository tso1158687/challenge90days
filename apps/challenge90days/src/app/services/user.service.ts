import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { UserInfo } from '@challenge90days/api-interfaces';
import { BehaviorSubject, Subject } from 'rxjs';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$ = new BehaviorSubject<any>({});
  userId$ = new BehaviorSubject<string>('');
  userInfo$ = new BehaviorSubject({});
  userCollection: AngularFirestoreCollection<UserInfo>;

  constructor(
    private firestore: AngularFirestore,
    private authService: NbAuthService
  ) {
    console.log('user service ');
    this.getUserInfoByToken();
  }

  getUserInfoByToken() {
    console.log('getuserinfo')
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      console.log(token);
      console.log(token.isValid());
      // console.log(!!this.user);
      if (token.isValid()) {
        this.user$.next(token.getPayload()); // here we receive a payload from the token and assigns it to our `user` variable
      }
    });
  }

  getUserInfo(userId: string): void {
    this.userCollection = this.firestore.collection<UserInfo>('user', (ref) => {
      return ref.where('userId', '==', userId);
    });

    this.userCollection.valueChanges().subscribe((userInfo) => {
      console.log(userInfo);
      this.userInfo$.next(userInfo[0]);
    });
  }

  updateUserId(userId: string): void {
    this.userId$.next(userId);
  }
}
