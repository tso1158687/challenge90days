import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { UserInfo } from '@challenge90days/api-interfaces';
import { BehaviorSubject } from 'rxjs';
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
    this.getUserInfoByToken();
  }

  getUserInfoByToken() {
 
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      const userInfo=token.getPayload()
      this.userId$.next(userInfo.user_id)
      if (token.isValid()) {
        this.user$.next(userInfo); 
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
