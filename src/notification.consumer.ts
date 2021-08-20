import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('notification-queue')
export class NotificationConsumer {
  @Process('notification-job')
  notificationjob(job: Job<unknown>) {
    console.log(job.data);
  }
}
