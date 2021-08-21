import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
@Injectable()
export class FileProducerService {
  constructor(@InjectQueue('file-operation') private queue: Queue) {}
  async deleteFile(fileName: String) {
    //add file path here
    //delete logic if neccesary
    await this.queue.add('delete-file');
  }
}
