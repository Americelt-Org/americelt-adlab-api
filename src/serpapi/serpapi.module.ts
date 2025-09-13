import { Module } from '@nestjs/common';
import { SerpapiService } from './serpapi.service';

@Module({
  providers: [SerpapiService],
  exports: [SerpapiService],
})
export class SerpapiModule {}
