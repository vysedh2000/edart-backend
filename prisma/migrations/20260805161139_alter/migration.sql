/*
  Warnings:

  - The primary key for the `txnSucess` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `exId` to the `txnSucess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "txnSucess" DROP CONSTRAINT "txnSucess_pkey",
ADD COLUMN     "exId" TEXT NOT NULL,
ADD CONSTRAINT "txnSucess_pkey" PRIMARY KEY ("exId");
