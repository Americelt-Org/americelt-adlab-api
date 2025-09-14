import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ScrapeTableService } from './scrape-table.service';
import { SessionGuard } from 'src/auth/guard/session.guard';

@Controller('scrapes')
@UseGuards(SessionGuard)
export class ScrapeTableController {

    constructor(
      private scrapeTableService: ScrapeTableService
    ){}

    @Get(':taskId')
    async getScrapesByTaskId( @Param() param: { taskId: string }) {

      const scrapes = await this.scrapeTableService.getScrapesByTaskId(param.taskId) 
      return {
        data: scrapes
      }
    }
}
