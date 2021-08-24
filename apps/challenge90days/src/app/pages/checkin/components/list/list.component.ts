import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { Checkin, UserInfo } from '@challenge90days/api-interfaces';

import { ActivatedRoute } from '@angular/router';
import { DateService } from '../../../../services/date.service';

@Component({
  selector: 'challenge90days-myself',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  userId: string;
  userCollection: AngularFirestoreCollection<any>;
  userList$: Observable<UserInfo[]>;
  checkinList$: Observable<Checkin[]>;
  checkinListQuery$ = new Subject<unknown>();
  selectedDate: Date;
  selectedUserId: string;
  mode = false;
  constructor(
    private firestore: AngularFirestore,
    private userService: UserService,
    private dateService: DateService,
    private activatedRoute: ActivatedRoute
  ) {
    this.userId = this.userService.userId$.value;
  }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.params);
    this.getUserId();
    this.getUserList();
  }

  getUserId(): void {
    this.userService.userId$.subscribe((userId) => {
      console.log(userId);
      this.getCheckinListData();
    });
  }

  getUserList(): void {
    this.userList$ = this.firestore.collection<UserInfo>('user').valueChanges();
  }

  getCheckinListData(): void {
    this.checkinList$ = this.checkinListQuery$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() =>
        this.firestore
          .collection<Checkin>('checkin', (ref) => {
            if (this.mode) {
              let finalQuery = ref
                .where('type', '==', 1)
                .orderBy('time', 'desc')
              if (this.selectedUserId) {
                console.log(this.selectedUserId);
                finalQuery = finalQuery.where(
                  'userId',
                  '==',
                  this.selectedUserId
                );
              }
              if (this.selectedDate) {
                const { startOfDay, endOfDay } = this.dateService.getDayRange(
                  this.selectedDate
                );
                finalQuery = finalQuery
                  .where('time', '>', startOfDay)
                  .where('time', '<', endOfDay);
              }
              return finalQuery;
            } else {
              return ref
                .where('userId', '==', this.userId)
                .where('type', '==', 1)
                .limit(65)
                .orderBy('time', 'desc');
            }
          })
          .valueChanges()
      )
    );
  }

  changeMode(tab: any): void {
    this.mode = tab.tabTitle === '看看大家';
    this.checkinListQuery$.next(this.mode);
  }

  changeUser(userId: string) {
    console.log(userId);
    this.checkinListQuery$.next(userId);
  }
  changeDate() {
    console.log(this.selectedDate);
    this.checkinListQuery$.next(this.selectedDate);
  }

  clearFilter() {
    this.selectedDate = null;
    this.selectedUserId = null;
    this.checkinListQuery$.next();
  }
}
