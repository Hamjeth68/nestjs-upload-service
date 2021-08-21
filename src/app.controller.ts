import { FileProducerService } from './file.producer.service';
import { NotificationProducerService } from './notification.producer.service';
import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private NotificationProducerService: NotificationProducerService,
    private FileProducerService: FileProducerService,
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

  @Get('delete-file')
  async deleteFile(@Query('fileName') fileName: string) {
    await this.FileProducerService.deleteFile(fileName);
    return 'deleted';
  }
}
