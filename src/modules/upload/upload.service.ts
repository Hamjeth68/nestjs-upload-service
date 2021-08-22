import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UploadService {
  constructor(@InjectQueue('UPLOAD_QUEUE') private uploadQueue: Queue) {}

  async addToQueue(file) {
    await this.uploadQueue.add(
      {
        id: '23213213',
      },
      {
        delay: 60000, // 15Min
        attempts: 1,
      },
    );
  }

  create(createUploadDto: CreateUploadDto) {
    return 'This action adds a new upload';
  }
}
