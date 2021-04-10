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
    const data = { text: message.message };
    console.log('ohohoh')

    this.httpService.post(
      'url',
      data
    ).subscribe(e=>{
      console.log(e)
      return  { message: 'ok' }
    },error=>{
      return {message:'ohnono'}
    });
  }
}
