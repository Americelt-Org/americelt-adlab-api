import { Injectable } from '@nestjs/common';
import { AdsResult, LocalResult, OrganicResult } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ResultExtractorService {

  constructor(
    private databaseService: DatabaseService
  ){}

  async saveAds(scraperId: string, data: any){
    const ads = data["ads"]

    if(!ads) {
      return
    }

    const allowedFields = [ 
      "position", "block_position", "title", 
      "link", "displayed_link", "tracking_link", 
      "extensions", "description", "source", "sitelinks", 
      "thumbnail", "details", "details_list"
    ];

    for (const ad of ads) {
      const validAds = this.filterResults(allowedFields, ad)

      await this.databaseService.adsResult.create({
        data: { ...validAds, scraper_id: scraperId }
      })
    }
  }

  async saveOrganicResults(scraperId: string, data: any) {
    const organicResults = data["organic_results"];

    if (!organicResults) {
      return;
    }

   const allowedFields = [
      "position","title","link","displayed_link","redirect_link","snippet",
      "sitelinks","favicon","snippet_highlighted_words","source","thumbnail",
      "rich_snippet","about_this_result","about_page_link","about_page_serpapi_link",
      "cached_page_link","related_pages_link","duration"
  ];

    for (const organicResult of organicResults) {
      const validData = this.filterResults(allowedFields, organicResult)

      await this.databaseService.organicResult.create({
        data: { ...validData, scrape_id: scraperId }
      });
    }
  }

  async saveLocalResults(scraperId: string, data: any){
    const localResults = data["local_results"]
    const places = localResults["places"]

    if(!localResults || !places || !places.length) {
      return
    }

    const allowedFields = [
      "position","title","place_id","data_id","reviews_link",
      "photos_link","gps_coordinates","place_id_search","provider_id",
      "rating","reviews","price","type","types","type_id","type_ids",
      "address","open_state","hours","operating_hours","phone","website",
      "description","thumbnail"
    ];

    for (const place of places) {
      const validData = this.filterResults(allowedFields, place)
      await this.databaseService.localResult.create({
        data: { ...validData, scrape_id: scraperId }
      })
    }
  }

  filterResults(allowedFields: string[], data: any) {
    const filteredResult: any = {};
    for (const key of allowedFields) {
      if (data.hasOwnProperty(key)) {
        filteredResult[key] = data[key];
      }
    }
    return filteredResult
  }

}
