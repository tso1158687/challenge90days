import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Checkin, UserInfo } from '@challenge90days/api-interfaces';
import { DateService } from '../../../services/date.service';
@Component({
  selector: 'challenge90days-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  userCollection: AngularFirestoreCollection<any>;
  eventChange$ = new Subject<number>();
  dateChange$ = new Subject();
  eventList$: Observable<any[]>;
  userList$: Observable<UserInfo[]>;
  checkinList$: Observable<Checkin[]>;
  selectedEventId: number;
  selectedDate = new Date();
  checkinListSet = new Set();
  pageChange$ = combineLatest([this.eventChange$, this.dateChange$]);
  startOfDay = this.dateService.startOfToday;
  endOfDay = this.dateService.endOfToday;

  constructor(
    private firestore: AngularFirestore,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.getEventList();
    this.getCheckinStatus();
    this.getCheckinListSet();
  }

  getEventList(): void {
    this.eventList$ = this.firestore.collection('event').valueChanges();
  }

  changeDate() {
    const { startOfDay, endOfDay } = this.dateService.getDayRange(
      this.selectedDate
    );
    this.startOfDay = startOfDay;
    this.endOfDay = endOfDay;
    this.dateChange$.next({
      startOfDay: this.startOfDay,
      endOfDate: this.endOfDay,
    });
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
    this.checkinList$ = this.pageChange$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() => {
        return this.firestore
          .collection<Checkin>('checkin', (ref) => {
            return ref
              .where('time', '>', this.startOfDay)
              .where('time', '<', this.endOfDay);
          })
          .valueChanges();
      })
    );

    this.checkinList$.subscribe((checkin) => {
      this.checkinListSet.clear();
      checkin.forEach((e) => {
        this.checkinListSet.add(e.userId);
      });
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
