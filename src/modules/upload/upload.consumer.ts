import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { HttpService } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';

@Processor('UPLOAD_QUEUE')
export class UploadConsumer {
  constructor(
    @InjectQueue('UPLOAD_QUEUE') private genieQueue: Queue,
    private readonly httpService: HttpService,
  ) {}

  @Process()
  async processUploadJob(job: Job, done) {
    const url = `http://localhost:3000/graphql`;
    const headersRequest = {
      'Content-Type': 'application/json',
    };
    const data = {
      query:
        'mutation{\n  createStudent(studentInput:{\n    name: "eshan933173",\n    dob: "1993-11-12",\n    email:"eshanwp@gmail.com",\n    age: 28\n  }){\n    id,\n    name,\n    dob,\n    email,\n    age\n  }\n}',
    };

    await this.httpService
      .post(url, data, { headers: headersRequest })
      .pipe(
        map((results) => {
          console.log(results);
        }),
      )
      .toPromise();
    // call done when finished
    done();
  }
}
