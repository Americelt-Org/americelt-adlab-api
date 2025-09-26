import { Injectable } from '@nestjs/common';
import { getJson } from 'serpapi';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ScraperService {
  constructor(
    private configService: ConfigService
  ){}

  async scrape(keyword: string, location: string, search_engine: string, device: string) {
    const results = await getJson({
      q: keyword,
      location: location,
      gl: 'us',
      engine: search_engine,
      device: device,
      api_key: this.configService.get<string>('SERP_API_KEY'),
    })

    return results;
  }
}
