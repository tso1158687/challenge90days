import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService, NbDateService } from '@nebular/theme';
import { CheckinService } from '../../../services/checkin.service';
import { FireworkService } from '../../../services/firework.service';
import { emojiList } from '../../../data/emoji';
import { DateService } from '../../../services/date.service';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { Checkin } from '@challenge90days/api-interfaces';

@Component({
  selector: 'challenge90days-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss'],
})
export class CheckinComponent implements OnInit {
  isCheckinMode = true;
  userInfo$ = this.userService.userInfo$;
  lastCheckin$: Observable<Checkin[]>;
  welcomeText: string;
  emojiList = emojiList;

  checkinForm: FormGroup;
  checkinStatus = false;
  constructor(
    private fb: FormBuilder,
    private checkinService: CheckinService,
    private toastrService: NbToastrService,
    private fireworkService: FireworkService,
    private cd: ChangeDetectorRef,
    private userService: UserService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.welcomeText = this.dateService.getWelcomeText();
    this.getCheckinStatus();
    this.getLastCheckin();
  }

  initForm(): void {
    this.checkinForm = this.fb.group({
      user: [''],
      message: ['', Validators.required],
      url: [''],
      imgFile: [null, Validators.required],
      emoji: [''],
      isCheckinTomorrow: [false],
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
    this.showFirework();
    this.toastrService.success('成功', '恭喜，又完成一天囉');
    this.checkinService.addCheckin(this.checkinForm.value).subscribe(() => {
      this.isCheckinMode = false;
    });
    this.initForm();
  }

  showFirework(): void {
    this.fireworkService.showFirework();
  }

  handleDateChange(event): void {
    console.log(event);
  }

  setEmoji(emoji: string): void {
    this.checkinForm.get('emoji').patchValue(emoji);
  }

  isCheckinTomorrow(isCheckinTomorrow: boolean): void {
    this.checkinForm.get('isCheckinTomorrow').patchValue(isCheckinTomorrow);
  }

  getLastCheckin(): void {
    this.lastCheckin$ = this.checkinService.getLastCheckin();
  }

  getCheckinStatus(): void {
    this.checkinService.getCheckinStatus().subscribe((checkinStatus) => {
      this.checkinStatus = checkinStatus;
      this.cd.markForCheck();
      console.log(this.checkinStatus);
    });
  }

  deleteAndAddCheckin() {
    this.checkinService.getLastCheckinRef().subscribe((checkinList) => {
      checkinList.docs[0].ref.delete().then(() => {
        this.checkin();
      });
    });
  }
}
