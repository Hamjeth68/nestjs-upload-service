import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class NotificationProducerService {
  constructor(@InjectQueue('notification-queue') private queue: Queue) {}
  async sendMessage(msg: string) {
    await this.queue.add(
      'notification-job',
      {
        text: msg,
      },
      { delay: 10000 },
    );
  }
}
