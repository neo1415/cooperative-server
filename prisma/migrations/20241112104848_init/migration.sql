/*
  Warnings:

  - Added the required column `expectedAmountToBePaidBack` to the `LoansRequested` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoansRequested" ADD COLUMN     "expectedAmountToBePaidBack" INTEGER NOT NULL;
