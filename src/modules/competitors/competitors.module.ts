import { Module } from '@nestjs/common';
import { CompetitorsService } from './competitors.service';
import { DatabaseModule } from 'src/modules/database/database.module';
import { CompetitorsController } from './competitors.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, UsersModule, JwtModule],
  providers: [CompetitorsService],
  exports: [CompetitorsService],
  controllers: [CompetitorsController]
})
export class CompetitorsModule {}
