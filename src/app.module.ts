import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './job/job.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [JobModule],
})
export class AppModule {}
