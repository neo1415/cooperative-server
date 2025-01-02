/*
  Warnings:

  - You are about to drop the column `dateLoanReceived` on the `Debtor` table. All the data in the column will be lost.
  - You are about to drop the column `interestOnLoan` on the `Debtor` table. All the data in the column will be lost.
  - You are about to drop the column `memberLoan` on the `Debtor` table. All the data in the column will be lost.
  - You are about to drop the column `membersCapital` on the `Debtor` table. All the data in the column will be lost.
  - You are about to drop the column `noOfMonths` on the `Debtor` table. All the data in the column will be lost.
  - You are about to drop the column `ordinarySavings` on the `Debtor` table. All the data in the column will be lost.
  - You are about to drop the column `specialSavings` on the `Debtor` table. All the data in the column will be lost.
  - Added the required column `amountRequired` to the `Debtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bvn` to the `Debtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationOfLoan` to the `Debtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedReimbursementDate` to the `Debtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameOfSurety1` to the `Debtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameOfSurety2` to the `Debtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purposeOfLoan` to the `Debtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surety1MembersNo` to the `Debtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surety1telePhone` to the `Debtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surety2MembersNo` to the `Debtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surety2telePhone` to the `Debtor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Debtor" DROP COLUMN "dateLoanReceived",
DROP COLUMN "interestOnLoan",
DROP COLUMN "memberLoan",
DROP COLUMN "membersCapital",
DROP COLUMN "noOfMonths",
DROP COLUMN "ordinarySavings",
DROP COLUMN "specialSavings",
ADD COLUMN     "amountGranted" INTEGER,
ADD COLUMN     "amountGuaranteed" TEXT,
ADD COLUMN     "amountRequired" INTEGER NOT NULL,
ADD COLUMN     "approved" BOOLEAN,
ADD COLUMN     "balanceInTheSavingsAccount" TEXT,
ADD COLUMN     "balanceOutstandingInterest" INTEGER,
ADD COLUMN     "balanceOutstandingPrincipal" INTEGER,
ADD COLUMN     "balanceOutstandingTotal" INTEGER,
ADD COLUMN     "bvn" TEXT NOT NULL,
ADD COLUMN     "dateOfApplication" TIMESTAMP(3),
ADD COLUMN     "durationOfLoan" INTEGER NOT NULL,
ADD COLUMN     "expectedAmountToBePaidBack" INTEGER,
ADD COLUMN     "expectedReimbursementDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "interestRate" DOUBLE PRECISION,
ADD COLUMN     "loanInterest" INTEGER,
ADD COLUMN     "membersNo" TEXT,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "nameOfSurety1" TEXT NOT NULL,
ADD COLUMN     "nameOfSurety2" TEXT NOT NULL,
ADD COLUMN     "paymentVoucherNO" TEXT,
ADD COLUMN     "pending" BOOLEAN,
ADD COLUMN     "purposeOfLoan" TEXT NOT NULL,
ADD COLUMN     "rejected" BOOLEAN,
ADD COLUMN     "repaymentsInterest" INTEGER,
ADD COLUMN     "repaymentsPrincipal" INTEGER,
ADD COLUMN     "surety1MembersNo" TEXT NOT NULL,
ADD COLUMN     "surety1balanceInTheSavingsAccount" TEXT,
ADD COLUMN     "surety1telePhone" TEXT NOT NULL,
ADD COLUMN     "surety2MembersNo" TEXT NOT NULL,
ADD COLUMN     "surety2balanceInTheSavingsAccount" TEXT,
ADD COLUMN     "surety2telePhone" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT;

-- CreateTable
CREATE TABLE "Defaulter" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "cooperativeId" TEXT NOT NULL,
    "surname" TEXT,
    "firstName" TEXT,
    "middleName" TEXT,
    "telephone" TEXT,
    "savingsDeposits" INTEGER NOT NULL,
    "grandTotal" INTEGER NOT NULL,
    "type" TEXT,

    CONSTRAINT "Defaulter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetDebtor" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "surname" TEXT,
    "firstName" TEXT,
    "middleName" TEXT,
    "dateOfApplication" TIMESTAMP(3),
    "assetName" TEXT,
    "assetPrice" TEXT,
    "assetShortDescription" TEXT,
    "img1" TEXT,
    "totalPrice" INTEGER,
    "durationOfLoan" INTEGER NOT NULL,
    "nameOfSurety1" TEXT NOT NULL,
    "surety1MembersNo" TEXT NOT NULL,
    "surety1telePhone" TEXT NOT NULL,
    "nameOfSurety2" TEXT NOT NULL,
    "surety2MembersNo" TEXT NOT NULL,
    "surety2telePhone" TEXT NOT NULL,
    "loanInterest" INTEGER,
    "interestRate" DOUBLE PRECISION,
    "expectedReimbursementDate" TIMESTAMP(3) NOT NULL,
    "expectedAmountToBePaidBack" INTEGER,
    "approved" BOOLEAN,
    "rejected" BOOLEAN,
    "pending" BOOLEAN,
    "cooperativeId" TEXT NOT NULL,

    CONSTRAINT "AssetDebtor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Defaulter" ADD CONSTRAINT "Defaulter_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDebtor" ADD CONSTRAINT "AssetDebtor_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
