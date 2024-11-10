/*
  Warnings:

  - You are about to drop the column `img` on the `CooperativeDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `CooperativeDetails` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `CooperativeDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "CooperativeDetails_registrationNumber_key";

-- AlterTable
ALTER TABLE "CooperativeDetails" DROP COLUMN "img",
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "registrationNumber" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CooperativeDetails_email_key" ON "CooperativeDetails"("email");
