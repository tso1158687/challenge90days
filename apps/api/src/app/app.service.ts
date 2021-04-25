import { HttpService, Injectable } from '@nestjs/common';
import { Message } from '@challenge90days/api-interfaces';
import { Cron, Interval } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService){}
  getData(): Message {
    return { message: 'Welcome to api!' };
  }
  // @Cron('10 * * * * *')
  @Interval(1000000)
  testCronJob() {
    const data = { text: '晚上11點囉，請大家記得打卡！😊' };
    this.httpService.post(
      process.env.slackApi,
      data
    ).subscribe(()=>{
      return  { message: 'ok' }
    },error=>{
      return {message:'ohnono'}
    });
  }

  @Cron('0 0 * * * *')
  notificationCheckin(){
    const data = { text: '晚上11點30分囉，請大家記得打卡！😊' };
    this.httpService.post(
      process.env.slackApi,
      data
    ).subscribe(()=>{
      return  { message: 'ok' }
    },error=>{
      return {message:'ohnono'}
    });
  }
}
