import { Injectable } from '@nestjs/common';
import { Competitor } from 'generated/prisma';
import { DatabaseService } from 'src/modules/database/database.service';

@Injectable()
export class CompetitorsService {

  constructor(
    private databaseService: DatabaseService
  ) { }


  async getByTaskId(id: string) {
    return await this.databaseService.competitor.findMany({
      where: {
        taskId: id
      },
      orderBy: {
        totalCount: 'desc'
      }
    })
  }

  async createOrUpdate(
    domain: string,
    taskId: string,
    type: 'ORGANIC' | 'LOCAL' | 'ADS',
  ) {
    if (!domain) return;

    // normalize domain (remove protocol, etc.)
    const cleanDomain = this.extractDomain(domain);
    if (!cleanDomain) return

    await this.databaseService.competitor.upsert({
      where: {
        taskId_domain: {
          taskId,
          domain: cleanDomain,
        },
      },
      update: {
        organicCount: { increment: type === 'ORGANIC' ? 1 : 0 },
        localCount: { increment: type === 'LOCAL' ? 1 : 0 },
        adsCount: { increment: type === 'ADS' ? 1 : 0 },
        totalCount: { increment: 1 },
      },
      create: {
        taskId,
        domain: cleanDomain,
        organicCount: type === 'ORGANIC' ? 1 : 0,
        localCount: type === 'LOCAL' ? 1 : 0,
        adsCount: type === 'ADS' ? 1 : 0,
        totalCount: 1,
      },
    });
    
    return
  }

  private extractDomain(raw: string): string | null {
    if (!raw) return null;

    try {
      // 1. Remove separators and clean whitespace
      let cleaned = raw.replace(/[›>]/g, " ").trim();
      cleaned = cleaned.replace(/\s+/g, " ");

      // 2. Take first chunk
      const firstPart = cleaned.split(" ")[0];

      // Quick sanity check: must contain a dot to be a domain
      if (!firstPart.includes(".")) {
        return null;
      }

      // 3. Add protocol if missing
      const normalized = firstPart.startsWith("http")
        ? firstPart
        : `http://${firstPart}`;

      // 4. Parse with URL
      const parsed = new URL(normalized);

      // 5. Return clean hostname
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
  }
}
