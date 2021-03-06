import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService, NbDateService } from '@nebular/theme';
import { CheckinService } from '../../../services/checkin.service';
import { FireworkService } from '../../../services/firework.service';
import { emojiList } from '../../../data/emoji';
import { DateService } from '../../../services/date.service';
import { UserService } from '../../../services/user.service';
import { forkJoin, from, Observable } from 'rxjs';
import { Checkin } from '@challenge90days/api-interfaces';
import Compressor from 'compressorjs';
import { LastCheckin } from '../enum/last-checkin.enum';

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
  checkinText = '';
  isLoading = false;
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
  onFileChange(event): void {
    console.log(event);
    if (event?.target?.files?.length > 5) {
      this.toastrService.danger('錯誤', '圖片超過5張，請重新選擇');
      const input = document.getElementById('checkin-file') as HTMLInputElement;
      input.value = '';
      return;
    }
    if (event.target.files && event.target.files.length) {
      const originalFiles: File[] = event.target.files;
      let fileArray$ = [];
      for (const [i, file] of Object.entries(originalFiles)) {
        const file$ = from(this.compress(file));
        fileArray$.push(file$);
      }
      forkJoin(fileArray$).subscribe((compressedFiles) => {
        console.log(compressedFiles);
        this.checkinForm.get('imgFile').patchValue(compressedFiles);
      });
    }
  }

  checkin(): void {
    this.toastrService.warning('上傳中', '請等待圖片上傳完成，請勿關閉視窗');
    this.isLoading = true;
    console.log(this.checkinForm.value);
    this.checkinService.addCheckin(this.checkinForm.value).subscribe((e) => {
      console.log('checkin success');
      console.log(e);

      this.showFirework();
      this.toastrService.success('成功', '恭喜，又完成一天囉');
      this.isCheckinMode = false;
      this.isLoading = false;
      this.resetFrom();
    });
  }

  dayOff(): void {
    this.checkinService.getDayOff().subscribe((e) => {
      console.log(e);
      this.toastrService.warning('成功', '請假成功');
    });
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
      this.checkinText =
        checkinStatus[0]?.type === 1
          ? '恭喜!今天已經打卡過囉'
          : '今天已經請假囉，打卡的話會取消請假或預約明天';
      this.checkinStatus = checkinStatus.length > 0;
      this.cd.markForCheck();
      console.log(this.checkinStatus);
    });
  }

  deleteAndAddCheckin() {
    this.toastrService.warning('重新打卡中', '重新打卡中，請稍候');
    this.isLoading = true;
    const isTomorrow = this.checkinForm.get('isCheckinTomorrow').value;
    if (isTomorrow) {
      this.checkinService.getCheckinRef(LastCheckin.Tomorrow).subscribe((checkinList) => {
        if (checkinList.docs.length > 0) {
          checkinList.docs[0].ref.delete().then(() => {
            this.checkin();
          });
        } else {
          this.checkin();
        }
      });
      this.checkinService.getCheckinRef(LastCheckin.Tomorrow).subscribe((e) => console.log(e));
    } else {
      this.checkinService.getCheckinRef(LastCheckin.Today).subscribe((checkinList) => {
        checkinList.docs[0].ref.delete().then(() => {
          this.checkin();
        });
      });
    }
  }

  compress(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,
        success: resolve,
        error: reject,
      });
    });
  }

  resetFrom() {
    this.initForm();
    const input = document.getElementById('checkin-file') as HTMLInputElement;
    input.value = '';
  }
}
