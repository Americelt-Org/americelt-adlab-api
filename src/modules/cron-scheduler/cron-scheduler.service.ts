import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronSchedulerService {

  constructor(
    private scheduleRegistry: SchedulerRegistry
  ){}

  async addCronTask(name: string, cron: CronJob) {

  }

}
