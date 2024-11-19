/*
  Warnings:

  - You are about to drop the column `registrationNumber` on the `CooperativeDetails` table. All the data in the column will be lost.
  - You are about to drop the column `registrationNumber` on the `MembersDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registrationNumber]` on the table `Cooperative` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registrationNumber]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CooperativeDetails_registrationNumber_key";

-- DropIndex
DROP INDEX "MembersDetails_registrationNumber_key";

-- AlterTable
ALTER TABLE "Cooperative" ADD COLUMN     "registrationNumber" TEXT;

-- AlterTable
ALTER TABLE "CooperativeDetails" DROP COLUMN "registrationNumber";

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "registrationNumber" TEXT;

-- AlterTable
ALTER TABLE "MembersDetails" DROP COLUMN "registrationNumber";

-- CreateIndex
CREATE UNIQUE INDEX "Cooperative_registrationNumber_key" ON "Cooperative"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Member_registrationNumber_key" ON "Member"("registrationNumber");
