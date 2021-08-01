import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { addDays } from 'date-fns/fp';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Checkin, UserInfo } from '@challenge90days/api-interfaces';
import { startOfToday, endOfToday } from 'date-fns';
@Component({
  selector: 'challenge90days-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  userCollection: AngularFirestoreCollection<any>;
  eventChange$ = new Subject<number>();
  eventList$: Observable<any[]>;
  userList$: Observable<UserInfo[]>;
  checkinList$: Observable<Checkin[]>;
  selectedEventId: number;
  checkinListSet = new Set();

  startOfToday = startOfToday();
  endOfToday = endOfToday();

  constructor(private firestore: AngularFirestore) {}
  ngOnInit(): void {
    console.log(this.startOfToday);
    console.log(this.endOfToday);
    this.getEventList();
    this.getCheckinStatus();
    this.getCheckinListSet();
  }

  getEventList(): void {
    this.eventList$ = this.firestore.collection('event').valueChanges();
  }

  changeEventId(eventId: number): void {
    this.eventChange$.next(eventId);
  }

  getCheckinStatus(): void {
    this.userList$ = this.eventChange$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((checkinListMode) =>
        this.firestore
          .collection<UserInfo>('user', (ref) => {
            return ref.where('eventId', 'array-contains', checkinListMode);
          })
          .valueChanges()
      )
    );
  }

  getCheckinListSet(): void {
    this.checkinList$ = this.eventChange$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((checkinListMode) =>
        this.firestore
          .collection<Checkin>('checkin', (ref) => {
            return ref
              .where('time', '>', this.startOfToday)
              .where('time', '<', this.endOfToday);
          })
          .valueChanges()
      )
    );

    this.checkinList$.subscribe((checkin) => {
      this.checkinListSet.clear();
      console.log(checkin);
      checkin.forEach((e) => {
        this.checkinListSet.add(e.userId);
      });
      console.log('檢查');
      console.log(this.checkinListSet.has('UBCtFOSKVQgzXgxjPRmIOrXgE1w1'));
      console.log(this.checkinListSet.has('123'));
    });
  }

  isCheckinToday(userId: string): boolean {
    return this.checkinListSet.has(userId);
  }
}

// TODO:關聯資料取法
// this.userList$.subscribe((e) => {
//   console.log(e);
//   console.log(e[2]?.checkinList[0]);
//   e[2]?.checkinList[0].get().then((doc) => {
//     console.log(doc.data());
//   });
// });

// date range
// let startDate=new Date(2021,7,1)
// let endDate=new Date(2021,7,5)
// console.log(startDate)
// var now = new Date();
// var daysOfYear = [];
// for (var d = new Date(2021,7,1); d <= endDate; d.setDate(d.getDate() + 1)) {
//     daysOfYear.push(new Date(d));
// }
// console.log(daysOfYear)
