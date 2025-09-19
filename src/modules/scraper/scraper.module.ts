import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { DatabaseModule } from 'src/modules/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ScraperService],
  exports: [ScraperService]
})
export class ScraperModule {}
