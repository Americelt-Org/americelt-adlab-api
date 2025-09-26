import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronSchedulerService {
  private readonly logger = new Logger(CronSchedulerService.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  async addCronTask(name: string, cronJob: CronJob): Promise<void> {
    try {
      this.schedulerRegistry.addCronJob(name, cronJob);
      cronJob.start();
      this.logger.log(`Cron job "${name}" has been added and started.`);
    } catch (error) {
      this.logger.error(`Failed to add cron job "${name}": ${error.message}`, error.stack);
      throw error;
    }
  }

  deleteCron(name: string): void {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      if (!job) {
        this.logger.warn(`Cron job "${name}" not found.`);
        return;
      }

      job.stop();
      this.schedulerRegistry.deleteCronJob(name);
      this.logger.log(`Cron job "${name}" has been stopped and deleted.`);
    } catch (error) {
      this.logger.error(`Failed to delete cron job "${name}": ${error.message}`, error.stack);
    }
  }

   stopCron(name: string): void {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      if (!job) {
        this.logger.warn(`Cron job "${name}" not found.`);
        return;
      }

      job.stop();
      this.logger.log(`Cron job "${name}" has been stopped.`);
    } catch (error) {
      this.logger.error(`Failed to stop cron job "${name}": ${error.message}`, error.stack);
    }
  }
}