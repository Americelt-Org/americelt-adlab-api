import { Module } from '@nestjs/common';
import { JobController } from './task.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { TaskService } from './task.service';
import { ScraperModule } from 'src/modules/scraper/scraper.module';
import { ResultExtractorModule } from 'src/modules/result-extractor/result-extractor.module';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RequesteStorageService } from 'src/request-storage.service';

@Module({
  imports: [
    DatabaseModule, 
    ScraperModule, 
    ResultExtractorModule, 
    UsersModule,
    JwtModule
  ],
  controllers: [JobController],
  providers: [TaskService, RequesteStorageService]
})
export class TaskModule {}
