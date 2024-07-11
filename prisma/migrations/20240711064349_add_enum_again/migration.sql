/*
  Warnings:

  - Changed the type of `type` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `PaymentMethod` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FinancialTypes" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "TransactionTypes" AS ENUM ('CREDIT', 'CASH', 'DEBIT', 'TRANSFER', 'QRIS');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "type",
ADD COLUMN     "type" "FinancialTypes" NOT NULL;

-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "type",
ADD COLUMN     "type" "TransactionTypes" NOT NULL;
