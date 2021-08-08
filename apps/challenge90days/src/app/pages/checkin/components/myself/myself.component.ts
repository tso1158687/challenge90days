import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { Checkin } from '@challenge90days/api-interfaces';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'challenge90days-myself',
  templateUrl: './myself.component.html',
  styleUrls: ['./myself.component.scss'],
})
export class MyselfComponent implements OnInit {
  docPath: string;
  checkin$: Observable<Checkin>;
  constructor(
    private firestore: AngularFirestore,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.docPath = this.activatedRoute.snapshot.params.docPath;
    this.getSingleCheckin()

  }

  getSingleCheckin(): void {
    this.checkin$ = this.firestore
      .collection<Checkin>('checkin')
      .doc(this.docPath)
      .valueChanges();
  }
}
