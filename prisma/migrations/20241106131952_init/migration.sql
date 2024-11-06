-- AlterTable
ALTER TABLE "LoanInterestSetting" ALTER COLUMN "minDurationMonths" DROP NOT NULL,
ALTER COLUMN "maxDurationMonths" DROP NOT NULL,
ALTER COLUMN "durationInterestRate" DROP NOT NULL,
ALTER COLUMN "minAmount" DROP NOT NULL,
ALTER COLUMN "maxAmount" DROP NOT NULL,
ALTER COLUMN "amountInterestRate" DROP NOT NULL;
