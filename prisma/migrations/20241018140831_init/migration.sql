/*
  Warnings:

  - Added the required column `amountGranted` to the `LoansRequested` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoansRequested" DROP COLUMN "amountGranted",
ADD COLUMN     "amountGranted" INTEGER NOT NULL;
