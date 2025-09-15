import { Injectable } from '@nestjs/common';
import { SerpapiService } from 'src/serpapi/serpapi.service';
import { BaseResponse, getJson } from 'serpapi';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ScraperService {
  constructor(
    private databaseService: DatabaseService,
    private configService: ConfigService
  ){}

  async scrape(keyword: string, location: string, search_engine: string, device: string) {
    const results = await getJson({
      q: keyword,
      location: location,
      engine: search_engine,
      device: device,
      api_key: this.configService.get<string>('SERP_API_KEY'),
    })

    return results;
  }
}
