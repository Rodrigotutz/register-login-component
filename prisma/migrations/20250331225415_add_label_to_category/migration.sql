/*
  Warnings:

  - Added the required column `label` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "label" TEXT NOT NULL;
