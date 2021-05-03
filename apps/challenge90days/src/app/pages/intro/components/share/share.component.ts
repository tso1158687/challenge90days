import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'challenge90days-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  testFrom:FormGroup
  private itemDoc: AngularFirestoreDocument<any>;
  itemsCollection:AngularFirestoreCollection
  items: Observable<any[]>;
  

  constructor(private firestore: AngularFirestore,private fb:FormBuilder) {
    this.itemsCollection=firestore.collection('intro')
    this.items = firestore.collection('intro').valueChanges();
  }

  ngOnInit(
  ){
    this.initForm()
  }

  initForm(){
    this.testFrom=this.fb.group({
      test:'hello,world'
    })
  }

  gogo(){
    console.log(this.testFrom.get('test').value)
    this.itemsCollection.add({
      content:this.testFrom.get('test').value,
      createDate:new Date(),
      title:'testaaa'
    })
  }

  update(item: any) {
    this.itemDoc.update(item);
  }

}
