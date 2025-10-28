/*
  Warnings:

  - You are about to drop the column `disponible` on the `TurnoCancha` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EstadoTurno" AS ENUM ('LIBRE', 'ALQUILADO', 'PRACTICA_DEPORTIVA', 'MANTENIMIENTO');

-- AlterTable
ALTER TABLE "TurnoCancha" DROP COLUMN "disponible",
ADD COLUMN     "estado" "EstadoTurno" NOT NULL DEFAULT 'LIBRE',
ADD COLUMN     "titularId" INTEGER,
ADD COLUMN     "titularTipo" TEXT;

-- DropEnum
DROP TYPE "public"."MetodoNotificacion";
