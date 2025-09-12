import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './job/job.module';

import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env';
import { DatabaseModule } from './database/database.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    JobModule,
    DatabaseModule,
    ConfigModule.forRoot({ 
      isGlobal: true, 
      validate: envSchema.parse
    }),
  ],
})
export class AppModule {}
