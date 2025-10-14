/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Entrenador` table. All the data in the column will be lost.
  - Added the required column `dia` to the `Cancha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaApertura` to the `Cancha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaCierre` to the `Cancha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioDni` to the `Entrenador` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cancha" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "tipoDeporte" TEXT NOT NULL,
    "interior" BOOLEAN NOT NULL,
    "capacidadMax" INTEGER NOT NULL,
    "precioHora" REAL NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "dia" TEXT NOT NULL,
    "horaApertura" TEXT NOT NULL,
    "horaCierre" TEXT NOT NULL
);
INSERT INTO "new_Cancha" ("activa", "capacidadMax", "id", "interior", "nombre", "precioHora", "tipoDeporte") SELECT "activa", "capacidadMax", "id", "interior", "nombre", "precioHora", "tipoDeporte" FROM "Cancha";
DROP TABLE "Cancha";
ALTER TABLE "new_Cancha" RENAME TO "Cancha";
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
