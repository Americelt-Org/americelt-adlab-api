import { Injectable } from '@nestjs/common';
import { Scrape } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ScrapeTableService {
  constructor(
    private databaseService: DatabaseService
  ) {}

  async getScrapesByTaskId(id: string): Promise<Scrape[]> {
    const scrapes = await this.databaseService.scrape.findMany({
      where: { taskId: id }
    })
    return scrapes
  }

  async getScrapeById(id: string): Promise<Scrape> {
    const scrape = await this.databaseService.scrape.findFirstOrThrow({
      where: { id }
    })
    return scrape
  }
}
