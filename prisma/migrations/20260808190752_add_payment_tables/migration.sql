-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentChannel" AS ENUM ('ORANGE_MONEY', 'MTN_MOMO', 'MOOV_MONEY', 'WAVE', 'FREE_MONEY', 'AIRTEL_MONEY', 'MPESA', 'CARD');

-- CreateEnum
CREATE TYPE "PaymentProviderName" AS ENUM ('MOCK', 'STRIPE', 'CINETPAY', 'PAYDUNYA', 'FLUTTERWAVE');

-- CreateEnum
CREATE TYPE "ContactCategory" AS ENUM ('TECHNICAL', 'ACCOUNT', 'SUBSCRIPTION', 'PAYMENT', 'BILLING', 'SUGGESTION', 'OTHER');

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "garageId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "provider" "PaymentProviderName" NOT NULL DEFAULT 'MOCK',
    "channel" "PaymentChannel" NOT NULL,
    "countryCode" TEXT,
    "currency" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "phoneNumber" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "planTier" "PlanTier",
    "externalReference" TEXT,
    "failureReason" TEXT,
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentWebhookEvent" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT,
    "provider" "PaymentProviderName" NOT NULL,
    "eventId" TEXT NOT NULL,
    "signatureValid" BOOLEAN NOT NULL,
    "rawPayload" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "category" "ContactCategory" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_reference_key" ON "PaymentTransaction"("reference");

-- CreateIndex
CREATE INDEX "PaymentTransaction_garageId_idx" ON "PaymentTransaction"("garageId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_garageId_status_idx" ON "PaymentTransaction"("garageId", "status");

-- CreateIndex
CREATE INDEX "PaymentTransaction_externalReference_idx" ON "PaymentTransaction"("externalReference");

-- CreateIndex
CREATE INDEX "PaymentWebhookEvent_transactionId_idx" ON "PaymentWebhookEvent"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentWebhookEvent_provider_eventId_key" ON "PaymentWebhookEvent"("provider", "eventId");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentWebhookEvent" ADD CONSTRAINT "PaymentWebhookEvent_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "PaymentTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
