import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { NbAuthService } from '@nebular/auth';
import { UserService } from '../../../../services/user.service';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'challenge90days-myself',
  templateUrl: './myself.component.html',
  styleUrls: ['./myself.component.scss'],
})
export class MyselfComponent implements OnInit {
  userId: string;
  articles$: Observable<any[]>;

  checkinList$: Observable<any[]>;
  checkinListMode$ = new Subject<boolean>();
  constructor(
    private firestore: AngularFirestore,
    private userService: UserService
  ) {
    this.userId = this.userService.userId$.value;
  }

  checkinListToggle = false;

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId(): void {
    this.userService.userId$.subscribe((userId) => {
      console.log(userId);
      this.getCheckinListData();
    });
  }

  changeCheckinListMode(mode): void {
    console.log(mode);
    this.checkinListMode$.next(mode);
  }

  getCheckinListData(): void {
    console.log('??????');
    this.checkinList$ = this.checkinListMode$.pipe(
      startWith(false),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((checkinListMode) =>
        this.firestore
          .collection('checkin', (ref) => {
            console.log(checkinListMode);
            if(checkinListMode){
              console.log('全部')
              return (
                ref
                  .orderBy('time', 'desc')
                  .limit(65)
              );
            }else{
              return (
                ref
                  .where('userId', '==', this.userId)
                  .orderBy('time', 'desc')
                  .limit(65)
              );
            }
           
          })
          .valueChanges()
      )
    );
  }
}
