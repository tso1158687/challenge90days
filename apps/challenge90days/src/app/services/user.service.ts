import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserInfo } from '@challenge90days/api-interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userId$ = new BehaviorSubject('')
  userInfo$ = new BehaviorSubject({})
  userCollection: AngularFirestoreCollection<UserInfo>;

  constructor(
    private firestore: AngularFirestore,
  ) {
    this.userId$.subscribe(userId => {
      this.getUserInfo(userId)
    })
  }

  getUserInfo(userId: string): void {
    this.userCollection = this.firestore.collection<any>('user', ref => {
      return ref.where('userId', '==', userId)
    })

    this.userCollection.valueChanges().subscribe(userInfos=>{
      this.userInfo$.next(userInfos[0])
    })
  }
}