-- CreateTable
CREATE TABLE "CooperativeAdminSettings" (
    "id" TEXT NOT NULL,
    "cooperativeId" TEXT NOT NULL,
    "loanFormPrice" INTEGER,
    "shareCapital" INTEGER,
    "entranceFee" INTEGER,
    "loanUpperLimit" DOUBLE PRECISION,
    "monthsToLoan" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CooperativeAdminSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CooperativeAdminSettings" ADD CONSTRAINT "CooperativeAdminSettings_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
