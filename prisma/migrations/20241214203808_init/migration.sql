/*
  Warnings:

  - You are about to drop the column `assetDescription` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `assetImg` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `assetName` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `assetPrice` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `memberAddress` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `memberBvn` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `memberEmail` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `memberFirstName` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `memberImg` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `memberNextOfKinName` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `memberNextOfKinPhone` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `memberRegistraTionNumber` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `memberSex` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `memberSurname` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `totalInterestRate` on the `AssetsRequested` table. All the data in the column will be lost.
  - Made the column `nameOfSurety1` on table `AssetsRequested` required. This step will fail if there are existing NULL values in that column.
  - Made the column `surety1MembersNo` on table `AssetsRequested` required. This step will fail if there are existing NULL values in that column.
  - Made the column `surety1telePhone` on table `AssetsRequested` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nameOfSurety2` on table `AssetsRequested` required. This step will fail if there are existing NULL values in that column.
  - Made the column `surety2MembersNo` on table `AssetsRequested` required. This step will fail if there are existing NULL values in that column.
  - Made the column `surety2telePhone` on table `AssetsRequested` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AssetsRequested" DROP COLUMN "assetDescription",
DROP COLUMN "assetImg",
DROP COLUMN "assetName",
DROP COLUMN "assetPrice",
DROP COLUMN "memberAddress",
DROP COLUMN "memberBvn",
DROP COLUMN "memberEmail",
DROP COLUMN "memberFirstName",
DROP COLUMN "memberImg",
DROP COLUMN "memberNextOfKinName",
DROP COLUMN "memberNextOfKinPhone",
DROP COLUMN "memberRegistraTionNumber",
DROP COLUMN "memberSex",
DROP COLUMN "memberSurname",
DROP COLUMN "totalInterestRate",
ADD COLUMN     "interestRate" DOUBLE PRECISION,
ALTER COLUMN "nameOfSurety1" SET NOT NULL,
ALTER COLUMN "surety1MembersNo" SET NOT NULL,
ALTER COLUMN "surety1telePhone" SET NOT NULL,
ALTER COLUMN "nameOfSurety2" SET NOT NULL,
ALTER COLUMN "surety2MembersNo" SET NOT NULL,
ALTER COLUMN "surety2telePhone" SET NOT NULL;
