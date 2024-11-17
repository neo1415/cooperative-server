// scripts/checkAndAddColumn.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function ensureColumn() {
  try {
    await prisma.$executeRaw`ALTER TABLE "LoansRequested" ADD COLUMN IF NOT EXISTS "expectedAmountToBePaidBack" INTEGER;`;
    console.log('Column checked and added if missing.');
  } catch (error) {
    console.error('Error ensuring column:', error);
  } finally {
    await prisma.$disconnect();
  }
}

ensureColumn();
