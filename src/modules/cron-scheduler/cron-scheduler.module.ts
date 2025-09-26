import { Module } from '@nestjs/common';
import { CronSchedulerService } from './cron-scheduler.service';
import { DatabaseModule } from '../database/database.module';
import { CronSchedulerListener } from './cron-scheduler.listener';

@Module({
  imports: [DatabaseModule],
  providers: [CronSchedulerService, CronSchedulerListener],
  exports: [CronSchedulerService]
})
export class CronSchedulerModule {}
