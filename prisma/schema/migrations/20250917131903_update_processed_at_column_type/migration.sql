/*
  Warnings:

  - Added the required column `updatedAt` to the `OrganicResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."LocalResult" ALTER COLUMN "processed_at" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."OrganicResult" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "processed_at" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Scrape" ALTER COLUMN "processed_at" SET DATA TYPE TEXT;
