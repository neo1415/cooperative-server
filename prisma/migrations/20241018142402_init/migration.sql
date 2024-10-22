/*
  Warnings:

  - Changed the type of `durationOfLoan` on the `LoansRequested` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LoansRequested" DROP COLUMN "durationOfLoan",
ADD COLUMN     "durationOfLoan" INTEGER NOT NULL;
