import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { RobomotionService } from 'src/robomotion/robomotion.service';

@Injectable()
export class JobService {

  constructor(private robomotionService: RobomotionService) {}

  async create(job: CreateJobDto) {
    const searchParams = new URLSearchParams({
      q: job.keywords.join(' '),
      l: job.location.locations.join(', '),
    })

    const domain = job.domain ? job.domain : 'https://www.google.com';
    const url = `${domain}/search?${searchParams.toString()}`;

    try {  
      await this.robomotionService.startJob(url)
      return { message: 'Job created', url }; 
    } catch (e) {
      throw new ServiceUnavailableException('Failed to start job' + e.message);
    }
  }

}
