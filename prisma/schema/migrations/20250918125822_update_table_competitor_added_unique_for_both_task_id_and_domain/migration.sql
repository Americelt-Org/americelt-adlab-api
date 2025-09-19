/*
  Warnings:

  - A unique constraint covering the columns `[taskId,domain]` on the table `Competitor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Competitor_taskId_domain_key" ON "public"."Competitor"("taskId", "domain");
