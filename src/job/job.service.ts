import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobService {

  create(job: CreateJobDto) {
    return { message: 'Job created', data: job }; 
  }

}
