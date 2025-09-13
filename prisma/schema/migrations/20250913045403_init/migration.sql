-- CreateEnum
CREATE TYPE "public"."Device" AS ENUM ('desktop', 'mobile', 'tablet');

-- CreateEnum
CREATE TYPE "public"."SearchEngine" AS ENUM ('google', 'bing', 'duckduckgo');

-- CreateEnum
CREATE TYPE "public"."LocationType" AS ENUM ('city', 'region', 'country', 'county', 'state', 'postal_code');

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
CREATE TABLE "public"."Local_Result" (
    "id" TEXT NOT NULL,
    "scrape_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "lsig" TEXT NOT NULL,
    "place_id_search" TEXT NOT NULL,
    "reviews" INTEGER NOT NULL,
    "price" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "gps_coordinates" JSONB NOT NULL,

    CONSTRAINT "Local_Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Organic_Result" (
    "id" TEXT NOT NULL,
    "scrape_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    "displayed_link" TEXT NOT NULL,
    "sitelinks" JSONB NOT NULL,

    CONSTRAINT "Organic_Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ads_Result" (
    "id" TEXT NOT NULL,
    "scrape_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT,
    "snippet" TEXT,
    "displayed_link" TEXT,
    "tracking_link" TEXT,
    "thumbnail" TEXT,
    "details" TEXT,
    "details_list" TEXT[],

    CONSTRAINT "Ads_Result_pkey" PRIMARY KEY ("id")
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
    "last_run_at" TIMESTAMP(3),
    "next_run_at" TIMESTAMP(3),
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
ALTER TABLE "public"."Competitor" ADD CONSTRAINT "Competitor_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Scrape" ADD CONSTRAINT "Scrape_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Local_Result" ADD CONSTRAINT "Local_Result_scrape_id_fkey" FOREIGN KEY ("scrape_id") REFERENCES "public"."Scrape"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Organic_Result" ADD CONSTRAINT "Organic_Result_scrape_id_fkey" FOREIGN KEY ("scrape_id") REFERENCES "public"."Scrape"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ads_Result" ADD CONSTRAINT "Ads_Result_scrape_id_fkey" FOREIGN KEY ("scrape_id") REFERENCES "public"."Scrape"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
