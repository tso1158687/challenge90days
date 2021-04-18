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
  sendToSlack(@Body() message ) {
    console.log('msg')
    console.log(message)
    const msg=`jason打卡囉 今天打卡內容：${message.message}`
    const data = { text: msg };
    console.log('ohohoh')

    this.httpService.post(
      'https://hooks.slack.com/services/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',
      data
    ).subscribe(e=>{
      console.log(e)
      return  { message: 'ok' }
    },error=>{
      return {message:'ohnono'}
    });
  }
}
