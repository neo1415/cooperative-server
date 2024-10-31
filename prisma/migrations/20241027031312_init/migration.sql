/*
  Warnings:

  - Added the required column `totalWithdrawals` to the `MemberSavings` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `savingsDeposits` on the `MemberSavings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `withdrawals` on the `MemberSavings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `savingsBalance` on the `MemberSavings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `grandTotal` on the `MemberSavings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MemberSavings" ADD COLUMN     "totalWithdrawals" INTEGER NOT NULL,
ALTER COLUMN "surname" DROP NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "middleName" DROP NOT NULL,
ALTER COLUMN "telephone" DROP NOT NULL,
DROP COLUMN "savingsDeposits",
ADD COLUMN     "savingsDeposits" INTEGER NOT NULL,
DROP COLUMN "withdrawals",
ADD COLUMN     "withdrawals" INTEGER NOT NULL,
DROP COLUMN "savingsBalance",
ADD COLUMN     "savingsBalance" INTEGER NOT NULL,
DROP COLUMN "grandTotal",
ADD COLUMN     "grandTotal" INTEGER NOT NULL;
