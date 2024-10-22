-- AlterTable
ALTER TABLE "LoansRequested" ALTER COLUMN "surety2balanceInTheSavingsAccount" DROP NOT NULL,
ALTER COLUMN "amountGuaranteed" DROP NOT NULL,
ALTER COLUMN "paymentVoucherNO" DROP NOT NULL,
ALTER COLUMN "amountGranted" DROP NOT NULL,
ALTER COLUMN "loanInterest" DROP NOT NULL,
ALTER COLUMN "repaymentsPrincipal" DROP NOT NULL,
ALTER COLUMN "repaymentsInterest" DROP NOT NULL,
ALTER COLUMN "balanceOutstandingPrincipal" DROP NOT NULL,
ALTER COLUMN "balanceOutstandingInterest" DROP NOT NULL,
ALTER COLUMN "balanceOutstandingTotal" DROP NOT NULL;
