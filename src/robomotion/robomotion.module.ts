import { Module } from '@nestjs/common';
import { RobomotionService } from './robomotion.service';

@Module({
  providers: [RobomotionService],
  exports: [RobomotionService],
})
export class RobomotionModule {}
