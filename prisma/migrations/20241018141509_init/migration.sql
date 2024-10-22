-- AlterTable
ALTER TABLE "LoansRequested" ALTER COLUMN "amountRequired" SET DATA TYPE TEXT,
ALTER COLUMN "amountGranted" DROP NOT NULL,
ALTER COLUMN "amountGranted" SET DATA TYPE TEXT;
