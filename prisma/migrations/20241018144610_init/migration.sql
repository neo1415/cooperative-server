/*
  Warnings:

  - Changed the type of `dateOfApplication` on the `LoansRequested` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LoansRequested" DROP COLUMN "dateOfApplication",
ADD COLUMN     "dateOfApplication" TIMESTAMP(3) NOT NULL;
