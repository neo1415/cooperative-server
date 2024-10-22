/*
  Warnings:

  - You are about to drop the column `repaymentDate` on the `LoansRequested` table. All the data in the column will be lost.
  - Added the required column `expectedReimbursementDate` to the `LoansRequested` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoansRequested" DROP COLUMN "repaymentDate",
ADD COLUMN     "expectedReimbursementDate" TIMESTAMP(3) NOT NULL;
