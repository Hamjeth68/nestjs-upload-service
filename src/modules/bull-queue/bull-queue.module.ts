import { Module } from '@nestjs/common';
import { BullQueueService } from './bull-queue.service';
import { BullQueueController } from './bull-queue.controller';
import { BullModule } from '@nestjs/bull';
import { UploadConsumer } from './upload.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'UPLOAD_QUEUE',
      redis: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
  ],
  controllers: [BullQueueController],
  providers: [UploadConsumer, BullQueueService],
})
export class BullQueueModule {}
