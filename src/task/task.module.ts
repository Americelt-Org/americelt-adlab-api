import { Module } from '@nestjs/common';
import { JobController } from './task.controller';

import { DatabaseModule } from 'src/database/database.module';
import { SerpapiModule } from 'src/serpapi/serpapi.module';
import { TaskService } from './task.service';
import { ScraperModule } from 'src/scraper/scraper.module';
import { ResultExtractorModule } from 'src/result-extractor/result-extractor.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule, 
    SerpapiModule, 
    ScraperModule, 
    ResultExtractorModule, 
    UsersModule,
    JwtModule
  ],
  controllers: [JobController],
  providers: [TaskService]
})
export class TaskModule {}
