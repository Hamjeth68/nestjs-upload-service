import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';

@Processor('UPLOAD_QUEUE')
export class UploadConsumer {
  constructor(@InjectQueue('UPLOAD_QUEUE') private genieQueue: Queue) {}

  @Process()
  async processUploadJob(job: Job, done) {
    // call done when finished
    console.log('processUploadJob' + job.data.file);
    done();
  }
}
