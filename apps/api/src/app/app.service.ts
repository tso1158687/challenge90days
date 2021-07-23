import { HttpService, Injectable } from '@nestjs/common';
import { Message } from '@challenge90days/api-interfaces';
import { Cron, Interval } from '@nestjs/schedule';

@Injectable()
export class AppService {
  linebot = require('linebot');
  bot = this.linebot({
    channelId: process.env.channelId,
    channelSecret: process.env.channelSecret,
    channelAccessToken: process.env.channelAccessToken,
  });
  constructor(private httpService: HttpService) {
    console.log('???');
  }
  getData(): Message {
    return { message: 'Welcome to api!' };
  }
  // @Cron('10 * * * * *')
  @Interval(1000000)
  testCronJob() {
    const data = { text: '晚上11點囉，請大家記得打卡！😊' };
    this.httpService.post(process.env.slackApi, data).subscribe(
      () => {
        return { message: 'ok' };
      },
      (error) => {
        return { message: 'ohnono' };
      }
    );
  }

  @Cron('0 0 * * * *')
  notificationCheckin(): void {
    const data = { text: '晚上11點30分囉，請大家記得打卡！😊' };
    this.httpService.post(process.env.slackApi, data).subscribe(
      () => {
        return { message: 'ok' };
      },
      (error) => {
        return { message: 'ohnono' };
      }
    );
  }

  pushMessageToLineChannel(message: string): void {
    this.bot.push('U8f7dd823e0059aa8ce6421f46cd72ecc', message);
  }

  listenLineWebhook(): void {
    this.bot.listen();
  }
}
