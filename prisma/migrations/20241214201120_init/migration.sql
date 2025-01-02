/*
  Warnings:

  - You are about to drop the column `interestRate` on the `AssetsRequested` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssetsRequested" DROP COLUMN "interestRate",
ADD COLUMN     "assetDescription" TEXT,
ADD COLUMN     "assetImg" TEXT,
ADD COLUMN     "assetName" TEXT,
ADD COLUMN     "assetPrice" TEXT,
ADD COLUMN     "memberAddress" TEXT,
ADD COLUMN     "memberBvn" TEXT,
ADD COLUMN     "memberEmail" TEXT,
ADD COLUMN     "memberFirstName" TEXT,
ADD COLUMN     "memberImg" TEXT,
ADD COLUMN     "memberNextOfKinName" TEXT,
ADD COLUMN     "memberNextOfKinPhone" TEXT,
ADD COLUMN     "memberRegistraTionNumber" TEXT,
ADD COLUMN     "memberSex" TEXT,
ADD COLUMN     "memberSurname" TEXT,
ADD COLUMN     "totalInterestRate" DOUBLE PRECISION,
ALTER COLUMN "nameOfSurety1" DROP NOT NULL,
ALTER COLUMN "surety1MembersNo" DROP NOT NULL,
ALTER COLUMN "surety1telePhone" DROP NOT NULL,
ALTER COLUMN "nameOfSurety2" DROP NOT NULL,
ALTER COLUMN "surety2MembersNo" DROP NOT NULL,
ALTER COLUMN "surety2telePhone" DROP NOT NULL;
