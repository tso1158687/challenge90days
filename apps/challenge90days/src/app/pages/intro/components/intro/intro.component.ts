import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'challenge90days-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {
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
