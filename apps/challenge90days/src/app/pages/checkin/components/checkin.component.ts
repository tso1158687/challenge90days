import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbToastrService, NbDateService } from '@nebular/theme';
import { CheckinService } from '../../../services/checkin.service';
import { FireworkService } from '../../../services/firework.service';
import { NbAuthService } from '@nebular/auth';
import { emojiList } from '../../../data/emoji';
import { DateService } from '../../../services/date.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'challenge90days-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss'],
})
export class CheckinComponent implements OnInit {
  userInfo$ = this.userService.userInfo$;
  welcomeText: string;
  emojiList = emojiList;

  checkinForm: FormGroup;
  date = new Date(new Date().getTime() + 86400000);
  minDate = new Date();
  maxDate = new Date(new Date().getTime() + 86400000 * 7);
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
    console.log(this.dateService.getTomorrowDateTime())
    // this.userService.userInfo$.subscribe(e=>console.log(e))
    this.initForm();
    console.log(this.maxDate);
    this.welcomeText = this.dateService.getWelcomeText();
  }

  initForm(): void {
    this.checkinForm = this.fb.group({
      user: '',
      message: '',
      url: '',
      imgFile: null,
      emoji: '',
      isCheckinTomorrow: false,
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
    const message = this.checkinForm.get('message').value;
    this.checkinService.addCheckin(this.checkinForm.value).subscribe((e) => {
      console.log('component');
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
}
