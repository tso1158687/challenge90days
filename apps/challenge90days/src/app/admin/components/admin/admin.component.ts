import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Checkin, UserInfo } from '@challenge90days/api-interfaces';
import { DateService } from '../../../services/date.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { STATUS_LIST } from '../../../data/status';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'challenge90days-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  public Editor = ClassicEditor;
  userCollection: AngularFirestoreCollection<any>;
  announceCollection: AngularFirestoreCollection<any>;
  announceForm: FormGroup;
  eventChange$ = new Subject<number>();
  dateChange$ = new Subject();
  eventList$: Observable<any[]>;
  userList$: Observable<UserInfo[]>;
  checkinList$: Observable<Checkin[]>;
  announceList$: Observable<any[]>;
  selectedEventId: number;
  selectedDate: Date;
  selectedStatus = '';
  checkinList: Checkin[] = [];
  checkinListSet = new Set();
  pageChange$ = combineLatest([this.eventChange$, this.dateChange$]);
  startOfDay = this.dateService.startOfToday;
  endOfDay = this.dateService.endOfToday;
  statusList = STATUS_LIST;
  constructor(
    private firestore: AngularFirestore,
    private dateService: DateService,
    private toastrService: NbToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getEventList();
    this.getCheckinStatus();
    this.getCheckinListSet();
    this.getAnnounceList();
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

    this.checkinList$.subscribe((checkinList) => {
      this.checkinList = checkinList;
      console.log(checkinList);
      this.checkinListSet.clear();
      checkinList.forEach((checkin) => {
        this.checkinListSet.add(checkin.userId);
      });
    });
  }

  isCheckinToday(userId: string): boolean {
    return this.checkinListSet.has(userId);
  }

  getIcon(userId: string): string {
    const isCheckinToday = this.isCheckinToday(userId);
    if (isCheckinToday) {
      const currentCheckin = this.checkinList.find(
        (checkin) => checkin.userId === userId
      );
      console.log(currentCheckin);
      return currentCheckin.type === 1
        ? 'checkmark-circle-outline'
        : 'minus-outline';
    } else {
      return 'close-circle-outline';
    }
  }
  initForm() {
    this.announceForm = this.fb.group({
      title: [null, Validators.required],
      status: '',
      content: ["", Validators.required],
      date: new Date(),
    });
  }
  changeStatus(status: string): void {
    this.announceForm.get('status').patchValue(status);
  }

  publishAnnounce(): void {
    const id = this.firestore.createId();
    const data = { ...this.announceForm.value, id };
    this.firestore
      .collection('announce')
      .doc(id)
      .set(data)
      .then(() => {
        this.toastrService.success('成功', '發布成功');
        this.initForm();
      });
  }
  deleteAnnounce(announce): void {
    console.log(announce);
    this.firestore
      .collection('announce')
      .doc(announce.id)
      .delete()
      .then(() => {
        this.toastrService.success('成功', '刪除成功');
      });
  }

  updateAnnounce(announce): void {
    this.firestore
      .collection('announce')
      .doc(announce.id)
      .update(announce)
      .then(() => {
        this.toastrService.success('成功', '更新成功');
      });
  }

  getAnnounceList(): void {
    this.announceList$ = this.firestore
      .collection('announce', (ref) => ref.orderBy('date', 'desc'))
      .valueChanges();
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
