import { Injectable } from '@nestjs/common';
import { AdsResult, LocalResult, OrganicResult } from 'generated/prisma';
import { CompetitorsService } from 'src/modules/competitors/competitors.service';
import { DatabaseService } from 'src/modules/database/database.service';

@Injectable()
export class ResultExtractorService {

  constructor(
    private databaseService: DatabaseService,
    private competitorsService: CompetitorsService
  ) { }

 async saveAds(scraperId: string, taskId: string, data: any) {
    if (!("ads" in data)) {
      return;
    }

    const ads = data["ads"];
    if (!ads || !Array.isArray(ads) || ads.length === 0) {
      return;
    }

    const processed_at = data["search_metadata"]?.processed_at ?? new Date();

    const allowedFields = [
      "position", "block_position", "title",
      "link", "displayed_link", "tracking_link",
      "extensions", "description", "source", "sitelinks",
      "thumbnail", "details", "details_list",
    ];

    for (const ad of ads) {
      const validAds = this.filterResults(allowedFields, ad);

      await this.databaseService.adsResult.create({
        data: { ...validAds, scraper_id: scraperId, processed_at },
      });

      // Save to competitors
      await this.competitorsService.createOrUpdate(
        validAds["displayed_link"] ?? "NO_DOMAIN",
        taskId,
        "ADS"
      );
    }
  }


 async saveOrganicResults(scraperId: string, taskId: string, data: any) {
    if (!("organic_results" in data)) {
      return;
    }

    const organicResults = data["organic_results"];
    if (!organicResults || !Array.isArray(organicResults) || organicResults.length === 0) {
      return;
    }

    const processed_at = data["search_metadata"]?.processed_at ?? new Date();

    const allowedFields = [
      "position", "title", "link", "displayed_link", "redirect_link", "snippet",
      "sitelinks", "favicon", "snippet_highlighted_words", "source", "thumbnail",
      "rich_snippet", "about_this_result", "about_page_link", "about_page_serpapi_link",
      "cached_page_link", "related_pages_link", "duration",
    ];

    for (const organicResult of organicResults) {
      const validData = this.filterResults(allowedFields, organicResult);

      await this.databaseService.organicResult.create({
        data: { ...validData, scrape_id: scraperId, processed_at },
      });

      // Save to competitors
      await this.competitorsService.createOrUpdate(
        validData["displayed_link"] ?? "NO_DOMAIN",
        taskId,
        "ORGANIC"
      );
    }
  }


  async saveLocalResults(scraperId: string, taskId: string, data: any) {
    if (!("local_results" in data)) {
      return;
    }

    const localResults = data["local_results"];
    if (!localResults) {
      return;
    }

    const places = localResults["places"];
    if (!places || !Array.isArray(places) || places.length === 0) {
      return;
    }

    const processed_at = data["search_metadata"]?.processed_at ?? new Date();

    const allowedFields = [
      "position", "title", "place_id", "data_id", "reviews_link",
      "photos_link", "gps_coordinates", "place_id_search", "provider_id",
      "rating", "reviews", "price", "type", "types", "type_id", "type_ids",
      "address", "open_state", "hours", "operating_hours", "phone", "website",
      "description", "thumbnail"
    ];

    for (const place of places) {
      const validData = this.filterResults(allowedFields, place);

      await this.databaseService.localResult.create({
        data: { ...validData, scrape_id: scraperId, processed_at },
      });

      const domain: string | undefined = place?.links?.website;

      // Save to competitors
      await this.competitorsService.createOrUpdate(
        domain ?? "NO_DOMAIN",
        taskId,
        "LOCAL"
      );
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
