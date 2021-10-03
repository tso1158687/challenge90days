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
  StickerMessage,
} from '@line/bot-sdk';
import { from, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class AppService {
  clientConfig: ClientConfig = {
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret,
  };
  client = new Client(this.clientConfig);
  groupId = process.env.groupIdStringList;
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

  // @Interval(1000000)
  // testCronJob() {
  //   const data = { text: '晚上11點囉，請大家記得打卡！😊' };
  //   this.httpService.post(process.env.slackApi, data).subscribe(
  //     () => {
  //       return { message: 'ok' };
  //     },
  //     (error) => {
  //       return { message: 'ohnono' };
  //     }
  //   );
  // }

  // @Cron('0 15 * * *')
  // notificationCheckin(): void {
  //   const message: TextMessage = {
  //     type: 'text',
  //     text: '晚上11點囉，請大家記得打卡！😊',
  //   };
  //   this.client.pushMessage(this.groupId, message);
  // }

  pushMessageToLineChannel(
    messageContent: any
  ): Observable<MessageAPIResponseBase> {
    console.log(messageContent);

    const { imageUrl, name, message, docPath, isTomorrow } = messageContent;
    console.log(messageContent);
    const textMessage = isTomorrow ? `${name} 預約打卡囉` : `${name} 打卡囉`;
    const templateMessage: TemplateMessage = {
      type: 'template',
      altText: textMessage,
      template: {
        type: 'buttons',
        thumbnailImageUrl: imageUrl,
        imageAspectRatio: 'rectangle',
        imageSize: 'cover',
        imageBackgroundColor: '#FFFFFF',
        title: textMessage,
        text: `${message}`,
        actions: [
          {
            type: 'uri',
            label: `看看${name}的打卡`,
            uri: `https://challenage90days.web.app/checkin/${docPath}`,
          },
        ],
      },
    };

    return from(this.client.pushMessage(this.groupId, templateMessage));
  }

  pushDayoffMessageToLineChannel({ name }): Observable<MessageAPIResponseBase> {
    // 節省流量
    // const stickerMessage: StickerMessage = {
    //   type: 'sticker',
    //   packageId: '6362',
    //   stickerId: '11087923',
    // };
    const textMessage: TextMessage = {
      type: 'text',
      text: `${name} 請假囉`,
    };

    return from(this.client.pushMessage(this.groupId, textMessage));
  }

}
