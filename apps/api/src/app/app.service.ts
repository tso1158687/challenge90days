import { HttpService, Injectable } from '@nestjs/common';
import { Message } from '@challenge90days/api-interfaces';
import { Cron, Interval } from '@nestjs/schedule';
import {
  ClientConfig,
  Client,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  TextMessage,
  MessageAPIResponseBase,
  ImageMessage,
} from '@line/bot-sdk';

@Injectable()
export class AppService {
  linebot = require('linebot');
  bot = this.linebot({
    channelId: process.env.channelId,
    channelSecret: process.env.channelSecret,
    channelAccessToken: process.env.channelAccessToken,
  });
  clientConfig: ClientConfig = {
    channelAccessToken:'',
    channelSecret: '',
  };
  client = new Client(this.clientConfig);
  constructor(private httpService: HttpService) {
    console.log('???');
    // this.listenLineWebhook()
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

  pushMessageToLineChannel(messageContent: string): void {
    const message: TextMessage = {
      type: 'text',
      text: messageContent,
    };

    const imageMessage: ImageMessage = {
      type: 'image',
      originalContentUrl:
        'https://firebasestorage.googleapis.com/v0/b/challenage90days.appspot.com/o/checkin%2FhV91NdH3WZVRsjOR6CYH?alt=media&token=c4513a43-6b9e-4044-8840-34b312a7d103',
      previewImageUrl:
        'https://firebasestorage.googleapis.com/v0/b/challenage90days.appspot.com/o/checkin%2FhV91NdH3WZVRsjOR6CYH?alt=media&token=c4513a43-6b9e-4044-8840-34b312a7d103',
    };

    this.client.pushMessage('', message);
    // this.bot.push('', message);
  }

  listenLineWebhook(): void {
    const port = process.env.PORT || 3333;
    // bot.listen('/linewebhook', 3000, function () { console.log('[BOT已準備就緒]');
    this.bot.parser();
    // this.bot.
  }

  getGroupMemberIds(groupId: string): void {
    this.client.getGroupMemberProfile(groupId,'').then((e) => {
      console.log(e);
    },error=>{
      console.log('錯')
      console.log(error)
    });
  }
}
