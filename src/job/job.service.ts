import { Injectable } from '@nestjs/common';

import { getJson } from "serpapi"
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { Device, Job, SearchEngine } from 'generated/prisma';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobService {

  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {}

  async create(job: CreateJobDto) {

    const newJob: Job = await this.databaseService.job.create({
      data: {
        userId: job.userId,
        name: job.name,
        keywords: job.keywords,
        search_engine: job.search_engine as unknown as SearchEngine,
        device: job.device as unknown as Device,
        location: job.location,
        cron: job.cron,
        is_active: false,
        last_run_at: new Date(),
        next_run_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    const jobs = await this.databaseService.job.findMany();

    return { message: 'Job created', jobs: jobs}; 
  }
}
