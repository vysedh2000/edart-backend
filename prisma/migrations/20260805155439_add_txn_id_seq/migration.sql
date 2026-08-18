-- CreateTable
CREATE TABLE "auth" (
    "aid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ccy" TEXT NOT NULL,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("aid")
);

-- CreateTable
CREATE TABLE "txnSuspect" (
    "batchId" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "debitAcc" TEXT NOT NULL,
    "creditAcc" TEXT NOT NULL,
    "txnCode" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "narative" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "txnSuspect_pkey" PRIMARY KEY ("batchId")
);

-- CreateTable
CREATE TABLE "depositSuspect" (
    "exId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "depositSuspect_pkey" PRIMARY KEY ("exId")
);

-- CreateTable
CREATE TABLE "txnSucess" (
    "txnId" TEXT NOT NULL,

    CONSTRAINT "txnSucess_pkey" PRIMARY KEY ("txnId")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_email_key" ON "auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_username_key" ON "auth"("username");
