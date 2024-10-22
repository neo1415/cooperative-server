/*
  Warnings:

  - The `loanInterest` column on the `LoansRequested` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `amountGranted` column on the `LoansRequested` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LoansRequested" DROP COLUMN "loanInterest",
ADD COLUMN     "loanInterest" INTEGER,
DROP COLUMN "amountGranted",
ADD COLUMN     "amountGranted" INTEGER;
