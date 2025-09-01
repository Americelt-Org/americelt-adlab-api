import { Body, Controller, Post } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { JobService } from './job.service';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  createJob(@Body() body: CreateJobDto) { 
    return this.jobService.create(body);
  }
}
