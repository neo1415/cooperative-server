/*
  Warnings:

  - A unique constraint covering the columns `[registrationNumber]` on the table `CooperativeDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registrationNumber]` on the table `MembersDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CooperativeDetails" ADD COLUMN     "registrationNumber" TEXT;

-- AlterTable
ALTER TABLE "MembersDetails" ADD COLUMN     "registrationNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CooperativeDetails_registrationNumber_key" ON "CooperativeDetails"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MembersDetails_registrationNumber_key" ON "MembersDetails"("registrationNumber");
