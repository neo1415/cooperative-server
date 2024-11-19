/*
  Warnings:

  - A unique constraint covering the columns `[registrationNumber]` on the table `CooperativeDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registrationNumber]` on the table `MembersDetails` will be added. If there are existing duplicate values, this will fail.
  - Made the column `cooperativeName` on table `CooperativeDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CooperativeDetails" ALTER COLUMN "cooperativeName" SET NOT NULL;

-- AlterTable
ALTER TABLE "MemberSavings" ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "MembersDetails" ADD COLUMN     "registrationNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CooperativeDetails_registrationNumber_key" ON "CooperativeDetails"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MembersDetails_registrationNumber_key" ON "MembersDetails"("registrationNumber");
