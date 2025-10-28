/*
  Warnings:

  - A unique constraint covering the columns `[canchaId,diaSemana]` on the table `HorarioCancha` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HorarioCancha_canchaId_diaSemana_key" ON "HorarioCancha"("canchaId", "diaSemana");
