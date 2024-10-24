/*
  Warnings:

  - You are about to drop the column `bvnNumber` on the `LoansApproved` table. All the data in the column will be lost.
  - The `dateOfApplication` column on the `LoansApproved` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `amountGranted` column on the `LoansApproved` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `loanInterest` column on the `LoansApproved` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `repaymentsPrincipal` column on the `LoansApproved` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `repaymentsInterest` column on the `LoansApproved` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `balanceOutstandingPrincipal` column on the `LoansApproved` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `balanceOutstandingInterest` column on the `LoansApproved` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `balanceOutstandingTotal` column on the `LoansApproved` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `bvn` to the `LoansApproved` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedReimbursementDate` to the `LoansApproved` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `amountRequired` on the `LoansApproved` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `durationOfLoan` on the `LoansApproved` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LoansApproved" DROP COLUMN "bvnNumber",
ADD COLUMN     "bvn" TEXT NOT NULL,
ADD COLUMN     "expectedReimbursementDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "surname" DROP NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "middleName" DROP NOT NULL,
ALTER COLUMN "membersNo" DROP NOT NULL,
DROP COLUMN "amountRequired",
ADD COLUMN     "amountRequired" INTEGER NOT NULL,
DROP COLUMN "dateOfApplication",
ADD COLUMN     "dateOfApplication" TIMESTAMP(3),
DROP COLUMN "durationOfLoan",
ADD COLUMN     "durationOfLoan" INTEGER NOT NULL,
ALTER COLUMN "balanceInTheSavingsAccount" DROP NOT NULL,
ALTER COLUMN "surety1balanceInTheSavingsAccount" DROP NOT NULL,
ALTER COLUMN "surety2balanceInTheSavingsAccount" DROP NOT NULL,
ALTER COLUMN "amountGuaranteed" DROP NOT NULL,
ALTER COLUMN "paymentVoucherNO" DROP NOT NULL,
DROP COLUMN "amountGranted",
ADD COLUMN     "amountGranted" INTEGER,
DROP COLUMN "loanInterest",
ADD COLUMN     "loanInterest" INTEGER,
DROP COLUMN "repaymentsPrincipal",
ADD COLUMN     "repaymentsPrincipal" INTEGER,
DROP COLUMN "repaymentsInterest",
ADD COLUMN     "repaymentsInterest" INTEGER,
DROP COLUMN "balanceOutstandingPrincipal",
ADD COLUMN     "balanceOutstandingPrincipal" INTEGER,
DROP COLUMN "balanceOutstandingInterest",
ADD COLUMN     "balanceOutstandingInterest" INTEGER,
DROP COLUMN "balanceOutstandingTotal",
ADD COLUMN     "balanceOutstandingTotal" INTEGER;
