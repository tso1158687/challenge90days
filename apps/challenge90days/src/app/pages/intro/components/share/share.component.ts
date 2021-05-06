import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'challenge90days-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit {
  itemsCollection: AngularFirestoreCollection;
  items: Observable<any[]>;

  constructor(private firestore: AngularFirestore) {
    this.itemsCollection = firestore.collection('intro');
    this.items = firestore.collection('intro',ref=>ref.orderBy("createDate", "asc")).valueChanges();
  }

  ngOnInit() {}
}
