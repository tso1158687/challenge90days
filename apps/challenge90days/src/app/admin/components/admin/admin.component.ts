import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserInfo } from '../../../../../../../libs/api-interfaces/src/lib/api-interfaces';

@Component({
  selector: 'challenge90days-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  userCollection: AngularFirestoreCollection<any>;
  eventChange$ = new Subject<number>();
  eventList$: Observable<any[]>;
  checkinList$: Observable<UserInfo[]>;
  selectedEventId: number;
  a:AngularFirestoreDocument

  constructor(private firestore: AngularFirestore) {}
  ngOnInit(): void {
    this.getCheckinStatus();
    this.getEventList();
  }

  getEventList(): void {
    this.eventList$ = this.firestore.collection('event').valueChanges();
  }

  changeEventId(eventId: number): void {
    this.eventChange$.next(eventId);
  }

  getCheckinStatus(): void {
    this.checkinList$ = this.eventChange$.pipe(
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
    this.checkinList$.subscribe((e) => {
      console.log(e)
      console.log(e[2]?.checkinList[0]);
      e[2]?.checkinList[0].get().then(doc=>{
        console.log(doc.data())
      })
    });
  }
}
