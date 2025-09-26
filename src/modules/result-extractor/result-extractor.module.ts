import { Module } from '@nestjs/common';
import { ResultExtractorService } from './result-extractor.service';
import { DatabaseModule } from 'src/modules/database/database.module';
import { CompetitorsModule } from 'src/modules/competitors/competitors.module';

@Module({
  imports: [DatabaseModule, CompetitorsModule],
  providers: [ResultExtractorService],
  exports: [ResultExtractorService]
})
export class ResultExtractorModule {}
