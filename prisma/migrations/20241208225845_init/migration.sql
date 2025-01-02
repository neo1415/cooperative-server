-- CreateTable
CREATE TABLE "Assets" (
    "id" TEXT NOT NULL,
    "cooperativeId" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "assetShortDescription" TEXT NOT NULL,
    "assetLongDescription" TEXT NOT NULL,
    "assetPrice" INTEGER,
    "img1" TEXT,
    "img2" TEXT,
    "img3" TEXT,
    "formPrice" INTEGER,
    "priceInterestRate" INTEGER,
    "minDurationMonths" INTEGER,
    "maxDurationMonths" INTEGER,
    "durationInterestRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetsRequested" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "surname" TEXT,
    "firstName" TEXT,
    "middleName" TEXT,
    "dateOfApplication" TIMESTAMP(3),
    "assetPrice" INTEGER,
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

    CONSTRAINT "AssetsRequested_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetsApproved" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "surname" TEXT,
    "firstName" TEXT,
    "middleName" TEXT,
    "dateOfApplication" TIMESTAMP(3),
    "assetPrice" INTEGER,
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

    CONSTRAINT "AssetsApproved_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetsRequested" ADD CONSTRAINT "AssetsRequested_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetsRequested" ADD CONSTRAINT "AssetsRequested_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetsApproved" ADD CONSTRAINT "AssetsApproved_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetsApproved" ADD CONSTRAINT "AssetsApproved_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
