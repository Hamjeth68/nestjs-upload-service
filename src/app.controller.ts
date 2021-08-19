import { NotificationProducerService } from './notification.producer.service';
import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private NotificationProducerService: NotificationProducerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('send-message')
  sendMessage(@Query('msg') msg: string) {
    this.NotificationProducerService.sendMessage(msg);
    return msg;
  }
}
