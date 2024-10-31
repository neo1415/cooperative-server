-- CreateTable
CREATE TABLE "LoanInterestSetting" (
    "id" TEXT NOT NULL,
    "cooperativeId" TEXT NOT NULL,
    "minDurationMonths" INTEGER NOT NULL,
    "maxDurationMonths" INTEGER NOT NULL,
    "durationInterestRate" DOUBLE PRECISION NOT NULL,
    "minAmount" INTEGER NOT NULL,
    "maxAmount" INTEGER NOT NULL,
    "amountInterestRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoanInterestSetting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoanInterestSetting" ADD CONSTRAINT "LoanInterestSetting_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
