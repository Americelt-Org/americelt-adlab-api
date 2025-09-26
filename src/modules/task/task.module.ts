import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { TaskService } from './task.service';
import { ScraperModule } from 'src/modules/scraper/scraper.module';
import { ResultExtractorModule } from 'src/modules/result-extractor/result-extractor.module';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ArchiveService } from './archive.service';

@Module({
  imports: [
    DatabaseModule, 
    ScraperModule, 
    ResultExtractorModule, 
    UsersModule,
    JwtModule
  ],
  controllers: [TaskController],
  providers: [TaskService, ArchiveService]
})
export class TaskModule {}
