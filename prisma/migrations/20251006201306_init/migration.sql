-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "fechaAlta" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Entrenador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "practicaId" INTEGER NOT NULL,
    CONSTRAINT "Entrenador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entrenador_practicaId_fkey" FOREIGN KEY ("practicaId") REFERENCES "PracticaDeportiva" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Socio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "tipoPlan" TEXT NOT NULL,
    "familiaId" INTEGER,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    CONSTRAINT "Socio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Socio_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "Familia" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Familia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apellido" TEXT NOT NULL,
    "descuento" REAL NOT NULL DEFAULT 0.3
);

-- CreateTable
CREATE TABLE "PracticaDeportiva" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "deporte" TEXT NOT NULL,
    "precio" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "HorarioPractica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "practicaId" INTEGER NOT NULL,
    "fecha" DATETIME,
    "horaInicio" DATETIME NOT NULL,
    "horaFin" DATETIME NOT NULL,
    "turnoId" INTEGER,
    CONSTRAINT "HorarioPractica_practicaId_fkey" FOREIGN KEY ("practicaId") REFERENCES "PracticaDeportiva" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HorarioPractica_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "TurnoCancha" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TurnoCancha" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "canchaId" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL,
    "horaInicio" DATETIME NOT NULL,
    "horaFin" DATETIME NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "TurnoCancha_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InscripcionDeportiva" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "socioId" INTEGER NOT NULL,
    "practicaId" INTEGER NOT NULL,
    "fechaInscripcion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "precioPagado" REAL NOT NULL,
    CONSTRAINT "InscripcionDeportiva_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InscripcionDeportiva_practicaId_fkey" FOREIGN KEY ("practicaId") REFERENCES "PracticaDeportiva" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cancha" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "tipoDeporte" TEXT NOT NULL,
    "interior" BOOLEAN NOT NULL,
    "capacidadMax" INTEGER NOT NULL,
    "precioHora" REAL NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "HorarioCancha" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "canchaId" INTEGER NOT NULL,
    "diaSemana" TEXT NOT NULL,
    "horaInicio" DATETIME NOT NULL,
    "horaFin" DATETIME NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "HorarioCancha_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AlquilerCancha" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "socioId" INTEGER NOT NULL,
    "turnoId" INTEGER NOT NULL,
    "fechaReserva" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estadoAlquiler" TEXT NOT NULL,
    "motivoCancelacion" TEXT,
    "fechaCancelacion" DATETIME,
    "notificado" BOOLEAN NOT NULL DEFAULT false,
    "pagoId" INTEGER,
    CONSTRAINT "AlquilerCancha_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AlquilerCancha_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "TurnoCancha" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AlquilerCancha_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Asistencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "socioId" INTEGER NOT NULL,
    "entrenadorId" INTEGER NOT NULL,
    "practicaId" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "presente" BOOLEAN NOT NULL,
    CONSTRAINT "Asistencia_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Asistencia_entrenadorId_fkey" FOREIGN KEY ("entrenadorId") REFERENCES "Entrenador" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Asistencia_practicaId_fkey" FOREIGN KEY ("practicaId") REFERENCES "PracticaDeportiva" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "socioId" INTEGER NOT NULL,
    "monto" REAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "fechaPago" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Pago_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ComprobantePago" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pagoId" INTEGER NOT NULL,
    "archivoUrl" TEXT NOT NULL,
    "fechaSubida" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ComprobantePago_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CuotaSocio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "socioId" INTEGER NOT NULL,
    "mes" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "monto" REAL NOT NULL,
    "pagada" BOOLEAN NOT NULL DEFAULT false,
    "fechaPago" DATETIME,
    "pagoId" INTEGER,
    CONSTRAINT "CuotaSocio_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CuotaSocio_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_dni_key" ON "Usuario"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Entrenador_usuarioId_key" ON "Entrenador"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_usuarioId_key" ON "Socio"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "ComprobantePago_pagoId_key" ON "ComprobantePago"("pagoId");
