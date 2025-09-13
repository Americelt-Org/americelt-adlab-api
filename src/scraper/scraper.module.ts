import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { SerpapiModule } from 'src/serpapi/serpapi.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [SerpapiModule, DatabaseModule],
  providers: [ScraperService],
  exports: [ScraperService]
})
export class ScraperModule {}
