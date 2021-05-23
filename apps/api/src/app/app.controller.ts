import { Body, Controller, Get, HttpService, Post } from '@nestjs/common';

import { Message } from '@challenge90days/api-interfaces';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private httpService: HttpService
  ) {}

  @Get('hello')
  getData(): Message {
    return this.appService.getData();
  }

  @Post('checkin')
  sendToSlack(@Body() content ) {
    console.log('msg')
    console.log(content)
    const msg=`jason打卡囉 今天打卡內容：${content.message}`
    const data = { text: msg };
    console.log('ohohoh')

    this.httpService.post(
      process.env.slackApi,
      data
    ).subscribe(e=>{
      console.log(e)
      return  { message: 'ok' }
    },error=>{
      return {message:'ohnono'}
    });
  }

  @Get('cronjob')
  testCronJob(){
    return this.appService.testCronJob()
  }
}
