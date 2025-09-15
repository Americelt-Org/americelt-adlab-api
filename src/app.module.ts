import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';

import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env';
import { DatabaseModule } from './database/database.module';
import { SerpapiModule } from './serpapi/serpapi.module';
import { CronSchedulerModule } from './cron-scheduler/cron-scheduler.module';
import { BullModule } from '@nestjs/bullmq';
import { ScraperModule } from './scraper/scraper.module';
import { ResultExtractorModule } from './result-extractor/result-extractor.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SessionMiddleware } from './middlewares/session.middleware';
import { JwtModule } from '@nestjs/jwt';
import { RequesteStorageService } from './request-storage.service';
import { LocationModule } from './location/location.module';


@Module({
  controllers: [AppController],
  providers: [AppService, RequesteStorageService],
  imports: [
    TaskModule,
    DatabaseModule,
    SerpapiModule,
    CronSchedulerModule,
    ScraperModule,
    ResultExtractorModule,
    AuthModule,
    UsersModule,
    JwtModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ 
      isGlobal: true, 
      validate: envSchema.parse
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: "scraper_queue"
    }),
    LocationModule
  ],
})
export class AppModule{}

// export class AppModule implements NestModule{
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(SessionMiddleware)
//             .exclude(
//               { path: '/auth/login', method: RequestMethod.POST },
//               { path: '/auth/register', method: RequestMethod.POST },
//             )
//             .forRoutes('*')
//   }
// }
