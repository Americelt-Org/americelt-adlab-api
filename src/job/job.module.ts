import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { RobomotionModule } from 'src/robomotion/robomotion.module';

@Module({
  imports: [RobomotionModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
