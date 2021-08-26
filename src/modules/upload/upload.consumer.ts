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

  
  async submitToUser(students : Student[]){

  

    // const query = gql`
    //  mutation{
    //   createStudent(studentInput:${student}){
    //     id
    //   }
    // }
    // `

      const query = gql`
      mutation createUser($studentArray: Student[]!) { 
        createStudent(studentInput:$studentArray){
            id
        }
      }
    `

  //    const query = gql`
  //    query getMovie($title: String!) {
  //      Movie(title: $title) {
  //        releaseDate
  //        actors {
  //          name
  //        }
  //      }
  //    }
  //  `
 
   const variables = {
    studentArray: students
   }
 
    // mutation{
    //   createStudent(studentInput:[{
    //     name: "eshan22",
    //     dob: "1993-11-12",
    //     email:"eshanwp@gmail.com",
    //     age: 28
    //   },
    //   {
    //     name: "eshan23",
    //     dob: "1993-11-12",
    //     email:"eshanwp@gmail.com",
    //     age: 28
    //   }]){
    //     id
    //   }
    // }

    try {   
      const data =  await request('http://localhost:3000/graphql',query,variables)
      console.log(JSON.stringify(data, undefined, 2))
      return true
    } catch (error) {
      console.error(JSON.stringify(error, undefined, 2))
      return false
    }
 


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
   

  if(student.length > 0) 
   {
        let success = await this.submitToUser(student)
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
