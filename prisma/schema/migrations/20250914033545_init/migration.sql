-- CreateEnum
CREATE TYPE "public"."Device" AS ENUM ('desktop', 'mobile', 'tablet');

-- CreateEnum
CREATE TYPE "public"."SearchEngine" AS ENUM ('google', 'bing', 'duckduckgo');

-- CreateEnum
CREATE TYPE "public"."LocationType" AS ENUM ('city', 'region', 'country', 'county', 'state', 'postal_code');

-- CreateTable
CREATE TABLE "public"."AdsResult" (
    "id" TEXT NOT NULL,
    "scrape_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "block_position" TEXT,
    "title" TEXT NOT NULL,
    "link" TEXT,
    "displayed_link" TEXT,
    "tracking_link" TEXT,
    "extensions" TEXT[],
    "description" TEXT,
    "source" TEXT,
    "sitelinks" JSONB,
    "thumbnail" TEXT,
    "details" TEXT,
    "details_list" TEXT[],

    CONSTRAINT "AdsResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Competitor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LocalResult" (
    "id" TEXT NOT NULL,
    "scrape_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "data_id" TEXT,
    "reviews_link" TEXT,
    "photos_link" TEXT,
    "gps_coordinates" JSONB,
    "place_id_search" TEXT,
    "provider_id" TEXT,
    "rating" DOUBLE PRECISION,
    "reviews" INTEGER,
    "price" TEXT,
    "type" TEXT,
    "types" TEXT[],
    "type_id" TEXT,
    "type_ids" TEXT[],
    "address" TEXT,
    "open_state" TEXT,
    "hours" TEXT,
    "operating_hours" JSONB,
    "phone" TEXT,
    "website" TEXT,
    "description" TEXT,
    "thumbnail" TEXT,

    CONSTRAINT "LocalResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrganicResult" (
    "id" TEXT NOT NULL,
    "scrape_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT,
    "displayed_link" TEXT,
    "redirect_link" TEXT,
    "snippet" TEXT,
    "sitelinks" JSONB,
    "favicon" TEXT,
    "snippet_highlighted_words" TEXT[],
    "source" TEXT,
    "thumbnail" TEXT,
    "rich_snippet" JSONB,
    "about_this_result" JSONB,
    "about_page_link" TEXT,
    "about_page_serpapi_link" TEXT,
    "cached_page_link" TEXT,
    "related_pages_link" TEXT,
    "duration" TEXT,

    CONSTRAINT "OrganicResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Scrape" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "last_run_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scrape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keywords" TEXT[],
    "search_engine" "public"."SearchEngine" NOT NULL,
    "device" "public"."Device" NOT NULL,
    "location" TEXT NOT NULL,
    "cron" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Competitor_domain_key" ON "public"."Competitor"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."AdsResult" ADD CONSTRAINT "AdsResult_scrape_id_fkey" FOREIGN KEY ("scrape_id") REFERENCES "public"."Scrape"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Competitor" ADD CONSTRAINT "Competitor_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LocalResult" ADD CONSTRAINT "LocalResult_scrape_id_fkey" FOREIGN KEY ("scrape_id") REFERENCES "public"."Scrape"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganicResult" ADD CONSTRAINT "OrganicResult_scrape_id_fkey" FOREIGN KEY ("scrape_id") REFERENCES "public"."Scrape"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Scrape" ADD CONSTRAINT "Scrape_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
