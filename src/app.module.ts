import { NotificationConsumer } from './notification.consumer';
import { NotificationProducerService } from './notification.producer.service';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { AppLogger } from './core/logger/app-logger';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadModule } from './modules/upload/upload.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'dev.env',
    }),
    BullModule.forRoot({
      redis: {
        host: 'locahost',
        port: 5000,
      },
    }),
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    UploadModule,
    BullModule.registerQueue({
      name: 'notification-queue',
    }),
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
