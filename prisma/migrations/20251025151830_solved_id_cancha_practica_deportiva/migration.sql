/*
  Warnings:

  - Added the required column `practicaDeportivaId` to the `Cancha` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."PracticaDeportiva_canchaId_key";

-- AlterTable
ALTER TABLE "Cancha" ADD COLUMN     "practicaDeportivaId" INTEGER NOT NULL;
