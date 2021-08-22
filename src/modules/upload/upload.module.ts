import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { UploadConsumer } from './upload.consumer';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        dest: config.get('MULTER_DEST'),
      }),
      inject: [ConfigService],
    }),
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
  controllers: [UploadController],
  providers: [UploadConsumer, UploadService],
})
export class UploadModule {}
