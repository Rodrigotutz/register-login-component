/*
  Warnings:

  - The `googleTokenExpiry` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "googleTokenExpiry",
ADD COLUMN     "googleTokenExpiry" INTEGER;
