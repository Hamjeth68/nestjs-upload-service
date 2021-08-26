import { InjectQueue, OnQueueCompleted, Process, Processor, OnQueueFailed } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { HttpService } from '@nestjs/common';
import { Student } from './entities/student.entity';
import { request, gql } from 'graphql-request'

const xlsxFile = require('read-excel-file/node');


@Processor('UPLOAD_QUEUE')
export class UploadConsumer {
  constructor(
    @InjectQueue('UPLOAD_QUEUE') private genieQueue: Queue,
    private readonly httpService: HttpService,
  ) {}

  
  submitToUser(students : Student[]){

    // const query = gql`mutation{createStudent(studentInput:students){id}`
    // return request(`http://localhost:3000/graphql`,query,students).then((data) => {
    //     console.log('submit  user success ',data)
    //     return true
    // }, () => {
    //   return false
    // });
    return true
  }

  @Process()
  async processUploadJob(job: Job, done) {
   let student : Student[] = []

   const fileName = job.data.file.filename

  try {
   await xlsxFile(`./uploads/${fileName}`).then((rows) => {
    const columnNames = rows.shift(); // Separate first row with column names
    rows.map((row) => { // Map the rest of the rows into objects
      const obj: any = {}; // Create object literal for current row
      row.forEach((cell, i) => {
        obj[columnNames[i]] = cell; // Use index from current cell to get column name, add current cell to new object
      });

      const stud :Student = {
        name: obj.Name,
        dob: obj.DOB,
        email: obj.Email,
        age: this.calculateAge(obj.DOB),
        
      };
      student.push(stud);
    });
  });

  }catch(error){
  console.log('error',error)
  }
   
  console.log('student',student)

  if(student.length > 0) 
   {
        let success = this.submitToUser(student)
        if(success)  { done() } else { return false  }
  
    }

  }


  calculateAge(birthday: Date) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }


  @OnQueueFailed()
  async onRetryQues(job: Job, result: Error) {


    console.log('queFailed',Error)
  }

  @OnQueueCompleted()
    async onSubmitUser(job: Job, result: any) {

      
      // call done when finished
      console.log('processUploadJob' + job.data.file);
      
  }
  
  
}
