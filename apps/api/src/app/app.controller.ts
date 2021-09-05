import { Body, Controller, Get, HttpService, HttpStatus, Param, Post,Response } from '@nestjs/common';

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
    console.log('hello')
    return this.appService.getData();
  }

  @Post('checkin')
  sendToSlack(@Body() content) {
    console.log('msg');
    console.log(content);
    const msg = `jason打卡囉 今天打卡內容：${content.message}`;
    const data = { text: msg };
    console.log('ohohoh');

    this.httpService.post(process.env.slackApi, data).subscribe(
      (e) => {
        console.log(e);
        return { message: 'ok' };
      },
      (error) => {
        return { message: 'ohnono' };
      }
    );
  }

  @Post('snedMessageToLineChannel')
  snedMessageToLineChannel(@Body() data,@Response() res) {
    this.appService.pushMessageToLineChannel(data).subscribe(()=>{
      return res.status(HttpStatus.OK).json(); 
    });
  }

  @Post('snedDayoffMessageToLineChannel')
  snedDayoffMessageToLineChannel(@Body() data,@Response() res) {
   
    this.appService.pushDayoffMessageToLineChannel(data).subscribe((d)=>{
     return res.status(HttpStatus.OK).json(); 
    });
  }
}
