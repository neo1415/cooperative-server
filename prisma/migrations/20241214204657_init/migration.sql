/*
  Warnings:

  - You are about to drop the column `assetName` on the `AssetsRequested` table. All the data in the column will be lost.
  - You are about to drop the column `assetPrice` on the `AssetsRequested` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssetsRequested" DROP COLUMN "assetName",
DROP COLUMN "assetPrice";
