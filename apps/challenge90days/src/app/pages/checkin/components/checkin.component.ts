import { ThrowStmt } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { CheckinService } from '../../../services/checkin.service';
import { FireworkService } from '../../../services/firework.service';

@Component({
  selector: 'challenge90days-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss'],
})
export class CheckinComponent implements OnInit {
  articles$: Observable<any[]>;
  checkinForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private checkinService: CheckinService,
    private toastrService: NbToastrService,
    private fireworkService: FireworkService,
    private cd: ChangeDetectorRef,
    // temp
    private firestore: AngularFirestore,
  ) {
    this.articles$ = firestore.collection('checkin', ref => ref
    // .where('postStatus','==',true)
    .orderBy('time', 'desc')
  )
    .valueChanges();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.checkinForm = this.fb.group({
      message: '',
      imgFile: null,
    });
  }
  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
    const file: File = event.target.files[0];
    this.checkinForm.get('imgFile').patchValue(file);
    this.cd.markForCheck();
    console.log(this.checkinForm.value);
    // reader.onload = () => {
    //   console.log(reader)

    //   // need to run CD since file load runs outside of zone
    //   console.log(this.checkinForm.value)
    // };
    }
  }

  checkin() {
    console.log(this.checkinForm.value);
    const message = this.checkinForm.get('message').value;
    this.checkinService.addCheckin(this.checkinForm.value).subscribe((e) => {
      console.log('component');
      this.toastrService.success('成功', '恭喜');
      this.showFirework()
    });
  }

  showFirework() {
    this.fireworkService.showFirework();
  }
}
