/*
  Warnings:

  - Added the required column `repaymentDate` to the `LoansRequested` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoansRequested" ADD COLUMN     "repaymentDate" TIMESTAMP(3) NOT NULL;
