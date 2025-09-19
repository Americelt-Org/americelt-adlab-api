import { Module } from '@nestjs/common';
import { ScrapeTableController } from './scrape-table.controller';
import { ScrapeTableService } from './scrape-table.service';
import { DatabaseModule } from 'src/modules/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule, JwtModule],
  controllers: [ScrapeTableController],
  providers: [ScrapeTableService]
})
export class ScrapeTableModule {}
