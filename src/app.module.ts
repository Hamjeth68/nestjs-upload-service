import { NotificationConsumer } from './notification.consumer';
import { NotificationProducerService } from './notification.producer.service';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { AppLogger } from './core/logger/app-logger';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadModule } from './modules/upload/upload.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullQueueModule } from './modules/bull-queue/bull-queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'dev.env',
    }),
    /*BullModule.registerQueue({
      name: 'UPLOAD_QUEUE',
      redis: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),*/
    ScheduleModule.forRoot(),
    UploadModule,
    BullModule.registerQueue(
      {
        name: 'notification-queue',
      },
      {
        name: 'file-operation',
      },
    ),
    BullQueueModule,
  ],
  controllers: [AppController],
  providers: [
    AppLogger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
    NotificationProducerService,
    NotificationConsumer,
  ],
})
export class AppModule {}
