/*
  Warnings:

  - The `repaymentsPrincipal` column on the `LoansRequested` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `repaymentsInterest` column on the `LoansRequested` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `balanceOutstandingPrincipal` column on the `LoansRequested` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `balanceOutstandingInterest` column on the `LoansRequested` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `balanceOutstandingTotal` column on the `LoansRequested` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LoansRequested" DROP COLUMN "repaymentsPrincipal",
ADD COLUMN     "repaymentsPrincipal" INTEGER,
DROP COLUMN "repaymentsInterest",
ADD COLUMN     "repaymentsInterest" INTEGER,
DROP COLUMN "balanceOutstandingPrincipal",
ADD COLUMN     "balanceOutstandingPrincipal" INTEGER,
DROP COLUMN "balanceOutstandingInterest",
ADD COLUMN     "balanceOutstandingInterest" INTEGER,
DROP COLUMN "balanceOutstandingTotal",
ADD COLUMN     "balanceOutstandingTotal" INTEGER;
