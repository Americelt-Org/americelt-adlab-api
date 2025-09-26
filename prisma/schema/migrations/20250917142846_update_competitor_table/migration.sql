/*
  Warnings:

  - You are about to drop the column `name` on the `Competitor` table. All the data in the column will be lost.
  - You are about to drop the `CompetitorAppearance` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."LocationType" ADD VALUE 'municipality';
ALTER TYPE "public"."LocationType" ADD VALUE 'district';
ALTER TYPE "public"."LocationType" ADD VALUE 'department';
ALTER TYPE "public"."LocationType" ADD VALUE 'university';

-- DropForeignKey
ALTER TABLE "public"."CompetitorAppearance" DROP CONSTRAINT "CompetitorAppearance_competitorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CompetitorAppearance" DROP CONSTRAINT "CompetitorAppearance_scrapeId_fkey";

-- AlterTable
ALTER TABLE "public"."Competitor" DROP COLUMN "name";

-- DropTable
DROP TABLE "public"."CompetitorAppearance";
