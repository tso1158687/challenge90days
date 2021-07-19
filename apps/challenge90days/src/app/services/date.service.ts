import { Injectable } from '@angular/core';
import { NbDateService } from '@nebular/theme';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor(private nbDateService: NbDateService<Date>) {}

  getWelcomeText(): string {
    const nowHour = this.nbDateService.getHours(new Date());
    let welcomeText = '你好';
    if (nowHour < 6) {
      welcomeText = '怎麼還沒睡？';
    } else if (nowHour < 12 && nowHour > 6) {
      welcomeText = '早安！';
    } else if (nowHour < 18 && nowHour > 6) {
      welcomeText = '午安！';
    } else {
      welcomeText = '終於晚上囉！';
    }

    return welcomeText;
  }

  getTomorrowDateTime(): Date {
    const tomorrowDate = this.nbDateService.addDay(new Date(), 1);
    return tomorrowDate;
  }
}
