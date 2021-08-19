import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'challenge90days-announce',
  templateUrl: './announce.component.html',
  styleUrls: ['./announce.component.scss']
})
export class AnnounceComponent implements OnInit {
  announceList$:Observable<any[]>
  constructor(
    private firestore:AngularFirestore
  ) { }

  ngOnInit(): void {
    this.getAnnounceList()
  }
  getAnnounceList(){
    this.announceList$=this.firestore.collection('announce').valueChanges()
  }
}
