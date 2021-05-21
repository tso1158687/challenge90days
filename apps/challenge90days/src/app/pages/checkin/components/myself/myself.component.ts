import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'challenge90days-myself',
  templateUrl: './myself.component.html',
  styleUrls: ['./myself.component.scss']
})
export class MyselfComponent implements OnInit {
  articles$: Observable<any[]>;

  constructor(
    private firestore: AngularFirestore,
  ) { 
    this.articles$ = firestore.collection('checkin', ref => ref
    .orderBy('time', 'desc')
  )
    .valueChanges();
  }

  ngOnInit(): void {
  }

}