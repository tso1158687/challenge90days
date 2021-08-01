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
  TemplateMessage,
} from '@line/bot-sdk';
import { from, Observable } from 'rxjs';

@Injectable()
export class AppService {
  linebot = require('linebot');
  bot = this.linebot({
    channelId: process.env.channelId,
    channelSecret: process.env.channelSecret,
    channelAccessToken: process.env.channelAccessToken,
  });
  clientConfig: ClientConfig = {
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret,
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

  pushMessageToLineChannel(messageContent: any): Observable<any> {
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

    const { imageUrl, user, content } = messageContent;

    const templateMessage: TemplateMessage = {
      type: 'template',
      altText: 'This is a buttons template',
      template: {
        type: 'buttons',
        thumbnailImageUrl: imageUrl,
        imageAspectRatio: 'rectangle',
        imageSize: 'cover',
        imageBackgroundColor: '#FFFFFF',
        title: `${user} 打卡囉`,
        text: `${content}`,
        actions: [
          {
            type: 'uri',
            label: '看看打卡',
            uri: 'https://challenage90days.web.app/',
          },
        ],
      },
    };
    // this.client.pushMessage(
    //我自己的
    //   'C5a3dccf669169a04808559e361295740',
    //   templateMessage
    // );

    const pushLineMesssagePromise = this.client.pushMessage(
      'C5a3dccf669169a04808559e361295740',
      templateMessage
    );
    return from(pushLineMesssagePromise);
    // this.bot.push('', message);
  }

  listenLineWebhook(): void {
    const port = process.env.PORT || 3333;
    // bot.listen('/linewebhook', 3000, function () { console.log('[BOT已準備就緒]');
    this.bot.parser();
    // this.bot.
  }

  getGroupMemberIds(groupId: string): void {
    this.client.getGroupMemberProfile(groupId, '').then(
      (e) => {
        console.log(e);
      },
      (error) => {
        console.log('錯');
        console.log(error);
      }
    );
  }
}
