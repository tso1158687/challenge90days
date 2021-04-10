import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { CheckinService } from '../../../services/checkin.service';

@Component({
  selector: 'challenge90days-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss'],
})
export class CheckinComponent implements OnInit {
  checkinForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private checkinService:CheckinService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.checkinForm = this.fb.group({
      message: '',
    });
  }

  checkin() {
    const message=this.checkinForm.get('message').value
    this.checkinService.addCheckin(message).subscribe(e=>{
      console.log('component')
      this.toastrService.success('成功', '恭喜');
    })
  }
}
