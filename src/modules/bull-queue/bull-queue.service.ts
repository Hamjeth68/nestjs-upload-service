import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BullQueueService {
  constructor(@InjectQueue('UPLOAD_QUEUE') private uploadQueue: Queue) {}

  async addToQueue() {
    await this.uploadQueue.add(
      {},
      {
        delay: 60000, // 15Min
        attempts: 1,
      },
    );
  }
}
