/*
  Warnings:

  - Added the required column `accountNumber` to the `MembersDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `MembersDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CooperativeDetails" ADD COLUMN "img" TEXT;

-- AlterTable with defaults for existing rows
ALTER TABLE "MembersDetails" 
  ADD COLUMN "accountNumber" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "bankName" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "img" TEXT;
