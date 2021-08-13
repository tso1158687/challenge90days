import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { Checkin } from '@challenge90days/api-interfaces';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'challenge90days-myself',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  userId: string;

  checkinList$: Observable<Checkin[]>;
  checkinListMode$ = new Subject<boolean>();
  constructor(
    private firestore: AngularFirestore,
    private userService: UserService,
    private activatedRoute:ActivatedRoute
  ) {
    this.userId = this.userService.userId$.value;
  }

  checkinListToggle = false;

  ngOnInit(): void {
  
    console.log(this.activatedRoute.snapshot.params)
    this.getUserId();
  }

  getUserId(): void {
    this.userService.userId$.subscribe((userId) => {
      console.log(userId);
      this.getCheckinListData();
    });
  }

  changeCheckinListMode(mode): void {
    this.checkinListMode$.next(mode);
  }

  getCheckinListData(): void {
    this.checkinList$ = this.checkinListMode$.pipe(
      startWith(false),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((checkinListMode) =>
        this.firestore
          .collection<Checkin>('checkin', (ref) => {
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

  changeMode(a){
    console.log('dsadadssddsa')
    console.log(a)
  }
}
