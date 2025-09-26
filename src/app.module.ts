import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './modules/task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema } from './config/env';
import { DatabaseModule } from './modules/database/database.module';
import { CronSchedulerModule } from './modules/cron-scheduler/cron-scheduler.module';
import { BullModule } from '@nestjs/bullmq';
import { ScraperModule } from './modules/scraper/scraper.module';
import { ResultExtractorModule } from './modules/result-extractor/result-extractor.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RequesteStorageService } from './request-storage.service';
import { LocationModule } from './modules/location/location.module';
import { CompetitorsModule } from './modules/competitors/competitors.module';
import { LoggerMiddleware } from './middlewares/logging.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';


@Module({
  controllers: [AppController],
  providers: [AppService, RequesteStorageService],
  imports: [
    TaskModule,
    DatabaseModule,
    CronSchedulerModule,
    ScraperModule,
    ResultExtractorModule,
    AuthModule,
    UsersModule,
    JwtModule,
    LocationModule,
    CompetitorsModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: envSchema.parse
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: "scraper_queue"
    }),

  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
