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
import { from, Observable, of } from 'rxjs';

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
  groupIdList = process.env.groupIdStringList.split(',');
  constructor(private httpService: HttpService) {}
  getData() {
    console.log(new Date());
    console.log(+new Date());
    return {
      message: 'Welcome to api!',
      date: new Date(),
      timestamp: +new Date(),
    };
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

  @Cron('* 15 * * *')
  notificationCheckin(): void {
    const message: TextMessage = {
      type: 'text',
      text: '晚上11點囉，請大家記得打卡！😊',
    };

    this.groupIdList.forEach((groupId) => {
      this.client.pushMessage(groupId, message);
    });
  }

  pushMessageToLineChannel(messageContent: any): Observable<any> {
    console.log(messageContent);
    // const message: TextMessage = {
    //   type: 'text',
    //   text: messageContent,
    // };

    // const imageMessage: ImageMessage = {
    //   type: 'image',
    //   originalContentUrl:
    //     'https://firebasestorage.googleapis.com/v0/b/challenage90days.appspot.com/o/checkin%2FhV91NdH3WZVRsjOR6CYH?alt=media&token=c4513a43-6b9e-4044-8840-34b312a7d103',
    //   previewImageUrl:
    //     'https://firebasestorage.googleapis.com/v0/b/challenage90days.appspot.com/o/checkin%2FhV91NdH3WZVRsjOR6CYH?alt=media&token=c4513a43-6b9e-4044-8840-34b312a7d103',
    // };

    const { imageUrl, name, message, docPath } = messageContent;
    console.log(messageContent);
    const templateMessage: TemplateMessage = {
      type: 'template',
      altText: `${name} 打卡囉`,
      template: {
        type: 'buttons',
        thumbnailImageUrl: imageUrl,
        imageAspectRatio: 'rectangle',
        imageSize: 'cover',
        imageBackgroundColor: '#FFFFFF',
        title: `${name} 打卡囉`,
        text: `${message}`,
        actions: [
          {
            type: 'uri',
            label: '看看打卡',
            uri: `https://challenage90days.web.app/checkin/${docPath}`,
          },
        ],
      },
    };
    this.groupIdList.forEach((groupId) => {
      this.client.pushMessage(groupId, templateMessage);
    });

    return of();
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
