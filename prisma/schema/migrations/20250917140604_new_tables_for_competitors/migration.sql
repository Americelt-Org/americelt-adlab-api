-- CreateEnum
CREATE TYPE "public"."CompetitorType" AS ENUM ('ORGANIC', 'LOCAL', 'ADS');

-- AlterTable
ALTER TABLE "public"."Competitor" ADD COLUMN     "adsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "avgAdsPos" DOUBLE PRECISION,
ADD COLUMN     "avgLocalPos" DOUBLE PRECISION,
ADD COLUMN     "avgOrganicPos" DOUBLE PRECISION,
ADD COLUMN     "localCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "organicCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."CompetitorAppearance" (
    "id" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,
    "scrapeId" TEXT NOT NULL,
    "type" "public"."CompetitorType" NOT NULL,
    "position" INTEGER,
    "link" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetitorAppearance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CompetitorAppearance" ADD CONSTRAINT "CompetitorAppearance_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "public"."Competitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompetitorAppearance" ADD CONSTRAINT "CompetitorAppearance_scrapeId_fkey" FOREIGN KEY ("scrapeId") REFERENCES "public"."Scrape"("id") ON DELETE CASCADE ON UPDATE CASCADE;
