import { ThrowStmt } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    private checkinService: CheckinService,
    private toastrService: NbToastrService,
    private cd: ChangeDetectorRef
  ) {}

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
    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        console.log(reader)
        this.checkinForm.get('imgFile').patchValue(reader.result);

        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
        console.log(this.checkinForm.value)
      };
    }
  }

  checkin() {
    console.log(this.checkinForm.value);
    const message = this.checkinForm.get('message').value;
    this.checkinService.addCheckin(this.checkinForm.value).subscribe((e) => {
      console.log('component');
      this.toastrService.success('成功', '恭喜');
    });
  }
}
