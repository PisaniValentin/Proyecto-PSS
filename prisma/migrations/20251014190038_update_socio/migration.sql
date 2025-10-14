/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Entrenador` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Socio` table. All the data in the column will be lost.
  - Added the required column `usuarioDni` to the `Entrenador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioDni` to the `Socio` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entrenador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioDni" TEXT NOT NULL,
    "practicaId" INTEGER,
    CONSTRAINT "Entrenador_usuarioDni_fkey" FOREIGN KEY ("usuarioDni") REFERENCES "Usuario" ("dni") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entrenador_practicaId_fkey" FOREIGN KEY ("practicaId") REFERENCES "PracticaDeportiva" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Entrenador" ("id", "practicaId") SELECT "id", "practicaId" FROM "Entrenador";
DROP TABLE "Entrenador";
ALTER TABLE "new_Entrenador" RENAME TO "Entrenador";
CREATE UNIQUE INDEX "Entrenador_usuarioDni_key" ON "Entrenador"("usuarioDni");
CREATE TABLE "new_Socio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioDni" TEXT NOT NULL,
    "tipoPlan" TEXT NOT NULL,
    "familiaId" INTEGER,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    CONSTRAINT "Socio_usuarioDni_fkey" FOREIGN KEY ("usuarioDni") REFERENCES "Usuario" ("dni") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Socio_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "Familia" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Socio" ("estado", "familiaId", "id", "tipoPlan") SELECT "estado", "familiaId", "id", "tipoPlan" FROM "Socio";
DROP TABLE "Socio";
ALTER TABLE "new_Socio" RENAME TO "Socio";
CREATE UNIQUE INDEX "Socio_usuarioDni_key" ON "Socio"("usuarioDni");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
