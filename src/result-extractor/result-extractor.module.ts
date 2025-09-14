import { Module } from '@nestjs/common';
import { ResultExtractorService } from './result-extractor.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ResultExtractorService],
  exports: [ResultExtractorService]
})
export class ResultExtractorModule {}
