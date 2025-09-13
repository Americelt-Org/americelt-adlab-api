import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getJson } from 'serpapi';



@Injectable()
export class SerpapiService {
  constructor(private configService: ConfigService,) {}

  async scrape(keywords: string, 
               location: string, 
               search_engine: string, 
               device: string) {
 
    const results = await getJson({
      q: keywords,
      location: location,
      engine: search_engine,
      device: device,
      api_key: this.configService.get<string>('SERP_API_KEY'),
    })

    return results;
  }
}
