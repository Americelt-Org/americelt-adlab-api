/*
  Warnings:

  - Added the required column `updatedAt` to the `LocalResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Scrape` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."LocalResult" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "processed_at" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "place_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Scrape" ADD COLUMN     "processed_at" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL;
