import { ThrowStmt } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { CheckinService } from '../../../services/checkin.service';
import { FireworkService } from '../../../services/firework.service';
import { NbAuthService } from '@nebular/auth';

@Component({
  selector: 'challenge90days-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss'],
})
export class CheckinComponent implements OnInit {
  checkinForm: FormGroup;
  date = new Date(new Date().getTime() + 86400000)
  minDate=new Date()
  maxDate =new Date(new Date().getTime() + 86400000*7)
  constructor(
    private fb: FormBuilder,
    private checkinService: CheckinService,
    private toastrService: NbToastrService,
    private fireworkService: FireworkService,
    private cd: ChangeDetectorRef,
    private authService: NbAuthService,
    // temp

  ) {

  }

  ngOnInit(): void {
    this.initForm();
    console.log(this.maxDate)
  }

  initForm(): void {
    this.checkinForm = this.fb.group({
      user: '',
      message: '',
      url: '',
      imgFile: null,
    });
  }
  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const file: File = event.target.files[0];
      this.checkinForm.get('imgFile').patchValue(file);
      this.cd.markForCheck();
      console.log(this.checkinForm.value);
    }
  }

  checkin() {
    console.log(this.checkinForm.value);
    this.showFirework()
    this.toastrService.success('成功', '恭喜，又完成一天囉');
    const message = this.checkinForm.get('message').value;
    this.checkinService.addCheckin(this.checkinForm.value).subscribe((e) => {
      console.log('component');
    });
    this.initForm()
  }

  showFirework(): void {
    this.fireworkService.showFirework();
  }

  handleDateChange(event): void {
    console.log(event)
  }
}
