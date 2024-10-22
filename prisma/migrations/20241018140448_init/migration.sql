/*
  Warnings:

  - Changed the type of `amountRequired` on the `LoansRequested` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LoansRequested" DROP COLUMN "amountRequired",
ADD COLUMN     "amountRequired" INTEGER NOT NULL;
