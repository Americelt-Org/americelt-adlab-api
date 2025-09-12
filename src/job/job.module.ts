import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { RobomotionModule } from 'src/robomotion/robomotion.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [RobomotionModule, DatabaseModule],
  controllers: [JobController],
  providers: [JobService]
})
export class JobModule {}
