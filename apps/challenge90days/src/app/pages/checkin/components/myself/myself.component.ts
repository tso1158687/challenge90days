import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NbAuthService } from '@nebular/auth';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'challenge90days-myself',
  templateUrl: './myself.component.html',
  styleUrls: ['./myself.component.scss']
})
export class MyselfComponent implements OnInit {
  userId: string
  articles$: Observable<any[]>;
  constructor(
    private firestore: AngularFirestore,
    private userService: UserService
  ) {
    this.userId = this.userService.userId$.value

  }

  ngOnInit(): void {
    this.getUserId()
  }

  getUserId(): void {
    this.userService.userId$.subscribe(userId => {
      console.log(userId)
      this.articles$ = this.firestore.collection('checkin', ref => ref
        // .where('userId', '==', userId)
        .orderBy('time', 'desc')
        .limit(65)
      )
        .valueChanges();
    })
  }

}
