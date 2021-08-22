import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';

@Processor('UPLOAD_QUEUE1')
export class UploadConsumer {
  constructor(@InjectQueue('UPLOAD_QUEUE1') private genieQueue: Queue) {}

  @Process()
  async processUploadJob(job: Job, done) {
    // call done when finished
    done();
  }
}
