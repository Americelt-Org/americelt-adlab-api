import { Module } from '@nestjs/common';
import { JobController } from './task.controller';

import { DatabaseModule } from 'src/database/database.module';
import { SerpapiModule } from 'src/serpapi/serpapi.module';
import { TaskService } from './task.service';
import { ScraperModule } from 'src/scraper/scraper.module';

@Module({
  imports: [DatabaseModule, SerpapiModule, ScraperModule],
  controllers: [JobController],
  providers: [TaskService]
})
export class TaskModule {}
