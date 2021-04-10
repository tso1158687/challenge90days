import { Controller, Get, HttpService } from '@nestjs/common';

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

  @Get('checkin')
  sendToSlack() {
    const data = { text: '從API來的訊息，大家安安' };
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
