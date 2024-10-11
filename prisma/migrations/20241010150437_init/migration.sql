-- CreateEnum
CREATE TYPE "UserSex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('MARRIED', 'SINGLE', 'WIDOWED');

-- CreateEnum
CREATE TYPE "SourceOFincome" AS ENUM ('SALARYORBUSINESSINCOME', 'INVESTMENTSORDIVIDENDS');

-- CreateEnum
CREATE TYPE "IDTYPE" AS ENUM ('INTERNATIONALPASSPORT', 'NIMC', 'DRIVERSLISENCE', 'VOTERSCARD');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cooperative" (
    "id" TEXT NOT NULL,
    "cooperativeName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cooperative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CooperativeDetails" (
    "cooperativeId" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "dateOfIncorporation" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "totalSavings" DOUBLE PRECISION DEFAULT 0,
    "totalDebt" DOUBLE PRECISION DEFAULT 0,
    "totalLoansRequested" DOUBLE PRECISION DEFAULT 0,
    "totalLoansApproved" DOUBLE PRECISION DEFAULT 0,
    "totalMembers" TEXT DEFAULT '',
    "totalDebtors" TEXT DEFAULT '',
    "totalProfit" DOUBLE PRECISION DEFAULT 0,
    "directorName" TEXT NOT NULL,
    "directorPosition" TEXT NOT NULL,
    "directorEmail" TEXT NOT NULL,
    "directorPhoneNumber" TEXT NOT NULL,
    "directorDateOfBirth" TIMESTAMP(3) NOT NULL,
    "directorPlaceOfBirth" TEXT NOT NULL,
    "directorNationality" TEXT NOT NULL,
    "directorOccupation" TEXT NOT NULL,
    "directorBVNNumber" TEXT NOT NULL,
    "directorIDType" "IDTYPE" NOT NULL,
    "directorIDNumber" TEXT NOT NULL,
    "directorIssuedDate" TEXT NOT NULL,
    "directorExpiryDate" TEXT NOT NULL,
    "directorSourceOfIncome" "SourceOFincome" NOT NULL
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "cooperativeId" TEXT,
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembersDetails" (
    "id" TEXT NOT NULL,
    "cooperativeId" TEXT,
    "memberId" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "dateOfEntry" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "telephone1" TEXT NOT NULL,
    "telephone2" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "sex" "UserSex" NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "business" TEXT NOT NULL,
    "residentialAddress" TEXT NOT NULL,
    "lga" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "permanentHomeAddress" TEXT NOT NULL,
    "stateOfOrigin" TEXT NOT NULL,
    "lga2" TEXT NOT NULL,
    "amountPaid" TEXT NOT NULL,
    "nextOfKinName" TEXT NOT NULL,
    "nextOfKinPhone" TEXT NOT NULL,
    "nextOfKinPhone2" TEXT NOT NULL,
    "sponsor" TEXT NOT NULL,

    CONSTRAINT "MembersDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberSavings" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "cooperativeId" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "dateOfEntry" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "telephone" TEXT NOT NULL,
    "savingsDeposits" TEXT NOT NULL,
    "withdrawals" TEXT NOT NULL,
    "savingsBalance" TEXT NOT NULL,
    "grandTotal" TEXT NOT NULL,

    CONSTRAINT "MemberSavings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoansRequested" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "membersNo" TEXT NOT NULL,
    "amountRequired" TEXT NOT NULL,
    "purposeOfLoan" TEXT NOT NULL,
    "dateOfApplication" TEXT NOT NULL,
    "durationOfLoan" TEXT NOT NULL,
    "balanceInTheSavingsAccount" TEXT NOT NULL,
    "bvnNumber" TEXT NOT NULL,
    "nameOfSurety1" TEXT NOT NULL,
    "surety1MembersNo" TEXT NOT NULL,
    "surety1telePhone" TEXT NOT NULL,
    "surety1balanceInTheSavingsAccount" TEXT NOT NULL,
    "nameOfSurety2" TEXT NOT NULL,
    "surety2MembersNo" TEXT NOT NULL,
    "surety2telePhone" TEXT NOT NULL,
    "surety2balanceInTheSavingsAccount" TEXT NOT NULL,
    "amountGuaranteed" TEXT NOT NULL,
    "paymentVoucherNO" TEXT NOT NULL,
    "amountGranted" TEXT NOT NULL,
    "loanInterest" TEXT NOT NULL,
    "repaymentsPrincipal" TEXT NOT NULL,
    "repaymentsInterest" TEXT NOT NULL,
    "balanceOutstandingPrincipal" TEXT NOT NULL,
    "balanceOutstandingInterest" TEXT NOT NULL,
    "balanceOutstandingTotal" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "rejected" BOOLEAN NOT NULL,
    "pending" BOOLEAN NOT NULL,
    "cooperativeId" TEXT NOT NULL,

    CONSTRAINT "LoansRequested_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoansApproved" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "membersNo" TEXT NOT NULL,
    "amountRequired" TEXT NOT NULL,
    "purposeOfLoan" TEXT NOT NULL,
    "dateOfApplication" TEXT NOT NULL,
    "durationOfLoan" TEXT NOT NULL,
    "balanceInTheSavingsAccount" TEXT NOT NULL,
    "bvnNumber" TEXT NOT NULL,
    "nameOfSurety1" TEXT NOT NULL,
    "surety1MembersNo" TEXT NOT NULL,
    "surety1telePhone" TEXT NOT NULL,
    "surety1balanceInTheSavingsAccount" TEXT NOT NULL,
    "nameOfSurety2" TEXT NOT NULL,
    "surety2MembersNo" TEXT NOT NULL,
    "surety2telePhone" TEXT NOT NULL,
    "surety2balanceInTheSavingsAccount" TEXT NOT NULL,
    "amountGuaranteed" TEXT NOT NULL,
    "paymentVoucherNO" TEXT NOT NULL,
    "amountGranted" TEXT NOT NULL,
    "loanInterest" TEXT NOT NULL,
    "repaymentsPrincipal" TEXT NOT NULL,
    "repaymentsInterest" TEXT NOT NULL,
    "balanceOutstandingPrincipal" TEXT NOT NULL,
    "balanceOutstandingInterest" TEXT NOT NULL,
    "balanceOutstandingTotal" TEXT NOT NULL,
    "cooperativeId" TEXT NOT NULL,

    CONSTRAINT "LoansApproved_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Debtor" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "cooperativeId" TEXT NOT NULL,
    "dateLoanReceived" TIMESTAMP(3) NOT NULL,
    "noOfMonths" INTEGER NOT NULL,
    "membersCapital" DOUBLE PRECISION NOT NULL,
    "ordinarySavings" DOUBLE PRECISION NOT NULL,
    "specialSavings" DOUBLE PRECISION NOT NULL,
    "memberLoan" DOUBLE PRECISION NOT NULL,
    "interestOnLoan" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Debtor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembersFinancialPosition" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "dateOfEntry" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "telephone" TEXT NOT NULL,
    "membersCapital" TEXT NOT NULL,
    "ordinarySavings" TEXT NOT NULL,
    "specialSavings" TEXT NOT NULL,
    "membersLoan" TEXT NOT NULL,
    "interestOnMembersLoan" TEXT NOT NULL,
    "BOILoans" TEXT NOT NULL,
    "grandTotal" TEXT NOT NULL,
    "intOnLoanAccrued" TEXT NOT NULL,

    CONSTRAINT "MembersFinancialPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personalLedgers" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "membersNo" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "entranceFee" TEXT NOT NULL,
    "shareCapital" TEXT NOT NULL,
    "savingsDeposits" TEXT NOT NULL,
    "withdrawals" TEXT NOT NULL,
    "savingsBalance" TEXT NOT NULL,
    "loanRecieved" TEXT NOT NULL,
    "loanRepayed" TEXT NOT NULL,
    "loanBalance" TEXT NOT NULL,
    "goodsAndServices" TEXT NOT NULL,
    "paymentsMade" TEXT NOT NULL,
    "balance" TEXT NOT NULL,
    "interestCharged" TEXT NOT NULL,
    "interestPaid" TEXT NOT NULL,
    "interestBalance" TEXT NOT NULL,

    CONSTRAINT "personalLedgers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isGlobal" BOOLEAN NOT NULL,
    "memberId" TEXT,
    "cooperativeId" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Cooperative_cooperativeName_key" ON "Cooperative"("cooperativeName");

-- CreateIndex
CREATE UNIQUE INDEX "Cooperative_email_key" ON "Cooperative"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CooperativeDetails_registrationNumber_key" ON "CooperativeDetails"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MembersDetails_memberId_key" ON "MembersDetails"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MembersDetails_telephone1_key" ON "MembersDetails"("telephone1");

-- CreateIndex
CREATE UNIQUE INDEX "MembersDetails_telephone2_key" ON "MembersDetails"("telephone2");

-- CreateIndex
CREATE UNIQUE INDEX "MembersDetails_email_key" ON "MembersDetails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MembersFinancialPosition_memberId_key" ON "MembersFinancialPosition"("memberId");

-- AddForeignKey
ALTER TABLE "CooperativeDetails" ADD CONSTRAINT "CooperativeDetails_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembersDetails" ADD CONSTRAINT "MembersDetails_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSavings" ADD CONSTRAINT "MemberSavings_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSavings" ADD CONSTRAINT "MemberSavings_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoansRequested" ADD CONSTRAINT "LoansRequested_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoansRequested" ADD CONSTRAINT "LoansRequested_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoansApproved" ADD CONSTRAINT "LoansApproved_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoansApproved" ADD CONSTRAINT "LoansApproved_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debtor" ADD CONSTRAINT "Debtor_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debtor" ADD CONSTRAINT "Debtor_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembersFinancialPosition" ADD CONSTRAINT "MembersFinancialPosition_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalLedgers" ADD CONSTRAINT "personalLedgers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE SET NULL ON UPDATE CASCADE;
