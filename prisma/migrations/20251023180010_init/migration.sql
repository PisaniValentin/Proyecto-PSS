-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'ENTRENADOR', 'SOCIO');

-- CreateEnum
CREATE TYPE "TipoPlan" AS ENUM ('INDIVIDUAL', 'FAMILIAR');

-- CreateEnum
CREATE TYPE "EstadoAlquiler" AS ENUM ('RESERVADO', 'CANCELADO', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "EstadoSocio" AS ENUM ('ACTIVO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "TipoDeporte" AS ENUM ('FUTBOL', 'BASQUET', 'NATACION', 'HANDBALL');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('CUOTA_SOCIO', 'PRACTICA_DEPORTIVA', 'ALQUILER');

-- CreateEnum
CREATE TYPE "Motivo" AS ENUM ('MANTENIMIENTO', 'LLUVIA', 'CORTE_DE_LUZ', 'CORTE_DE_AGUA', 'PROBLEMAS_CALEFACCION');

-- CreateEnum
CREATE TYPE "Meses" AS ENUM ('ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "MetodoNotificacion" AS ENUM ('EMAIL', 'APP');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "fechaAlta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrenador" (
    "id" SERIAL NOT NULL,
    "usuarioDni" TEXT NOT NULL,
    "actividadDeportiva" "TipoDeporte" NOT NULL,

    CONSTRAINT "Entrenador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Socio" (
    "id" SERIAL NOT NULL,
    "usuarioDni" TEXT NOT NULL,
    "tipoPlan" "TipoPlan" NOT NULL,
    "familiaId" INTEGER,
    "estado" "EstadoSocio" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Familia" (
    "id" SERIAL NOT NULL,
    "apellido" TEXT NOT NULL,
    "descuento" DOUBLE PRECISION NOT NULL DEFAULT 0.3,

    CONSTRAINT "Familia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticaDeportiva" (
    "id" SERIAL NOT NULL,
    "deporte" "TipoDeporte" NOT NULL,
    "canchaId" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PracticaDeportiva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HorarioPractica" (
    "id" SERIAL NOT NULL,
    "practicaId" INTEGER NOT NULL,
    "dia" "DiaSemana" NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,

    CONSTRAINT "HorarioPractica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TurnoCancha" (
    "id" SERIAL NOT NULL,
    "canchaId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TurnoCancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InscripcionDeportiva" (
    "id" SERIAL NOT NULL,
    "socioId" INTEGER NOT NULL,
    "practicaId" INTEGER NOT NULL,
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "precioPagado" DOUBLE PRECISION NOT NULL,
    "pagoId" INTEGER,

    CONSTRAINT "InscripcionDeportiva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cancha" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipoDeporte" "TipoDeporte" NOT NULL,
    "interior" BOOLEAN NOT NULL,
    "capacidadMax" INTEGER NOT NULL,
    "precioHora" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Cancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HorarioCancha" (
    "id" SERIAL NOT NULL,
    "canchaId" INTEGER NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HorarioCancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlquilerCancha" (
    "id" SERIAL NOT NULL,
    "socioId" INTEGER NOT NULL,
    "turnoId" INTEGER NOT NULL,
    "fechaReserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estadoAlquiler" "EstadoAlquiler" NOT NULL,
    "motivoCancelacion" "Motivo",
    "fechaCancelacion" TIMESTAMP(3),
    "notificado" BOOLEAN NOT NULL DEFAULT false,
    "pagoId" INTEGER,

    CONSTRAINT "AlquilerCancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asistencia" (
    "id" SERIAL NOT NULL,
    "socioId" INTEGER NOT NULL,
    "entrenadorId" INTEGER NOT NULL,
    "practicaId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "presente" BOOLEAN NOT NULL,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "socioId" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "tipo" "TipoPago" NOT NULL,
    "fechaPago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComprobantePago" (
    "id" SERIAL NOT NULL,
    "pagoId" INTEGER NOT NULL,
    "archivoUrl" TEXT NOT NULL,
    "fechaSubida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComprobantePago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuotaSocio" (
    "id" SERIAL NOT NULL,
    "socioId" INTEGER NOT NULL,
    "mes" "Meses" NOT NULL,
    "anio" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "pagada" BOOLEAN NOT NULL DEFAULT false,
    "fechaPago" TIMESTAMP(3),
    "pagoId" INTEGER,

    CONSTRAINT "CuotaSocio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PracticaEntrenador" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PracticaEntrenador_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_dni_key" ON "Usuario"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Entrenador_usuarioDni_key" ON "Entrenador"("usuarioDni");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_usuarioDni_key" ON "Socio"("usuarioDni");

-- CreateIndex
CREATE UNIQUE INDEX "PracticaDeportiva_canchaId_key" ON "PracticaDeportiva"("canchaId");

-- CreateIndex
CREATE UNIQUE INDEX "TurnoCancha_canchaId_fecha_horaInicio_key" ON "TurnoCancha"("canchaId", "fecha", "horaInicio");

-- CreateIndex
CREATE UNIQUE INDEX "ComprobantePago_pagoId_key" ON "ComprobantePago"("pagoId");

-- CreateIndex
CREATE INDEX "_PracticaEntrenador_B_index" ON "_PracticaEntrenador"("B");

-- AddForeignKey
ALTER TABLE "Entrenador" ADD CONSTRAINT "Entrenador_usuarioDni_fkey" FOREIGN KEY ("usuarioDni") REFERENCES "Usuario"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socio" ADD CONSTRAINT "Socio_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "Familia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socio" ADD CONSTRAINT "Socio_usuarioDni_fkey" FOREIGN KEY ("usuarioDni") REFERENCES "Usuario"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticaDeportiva" ADD CONSTRAINT "PracticaDeportiva_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioPractica" ADD CONSTRAINT "HorarioPractica_practicaId_fkey" FOREIGN KEY ("practicaId") REFERENCES "PracticaDeportiva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoCancha" ADD CONSTRAINT "TurnoCancha_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InscripcionDeportiva" ADD CONSTRAINT "InscripcionDeportiva_practicaId_fkey" FOREIGN KEY ("practicaId") REFERENCES "PracticaDeportiva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InscripcionDeportiva" ADD CONSTRAINT "InscripcionDeportiva_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InscripcionDeportiva" ADD CONSTRAINT "InscripcionDeportiva_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioCancha" ADD CONSTRAINT "HorarioCancha_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlquilerCancha" ADD CONSTRAINT "AlquilerCancha_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlquilerCancha" ADD CONSTRAINT "AlquilerCancha_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlquilerCancha" ADD CONSTRAINT "AlquilerCancha_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "TurnoCancha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_entrenadorId_fkey" FOREIGN KEY ("entrenadorId") REFERENCES "Entrenador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_practicaId_fkey" FOREIGN KEY ("practicaId") REFERENCES "PracticaDeportiva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprobantePago" ADD CONSTRAINT "ComprobantePago_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuotaSocio" ADD CONSTRAINT "CuotaSocio_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuotaSocio" ADD CONSTRAINT "CuotaSocio_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PracticaEntrenador" ADD CONSTRAINT "_PracticaEntrenador_A_fkey" FOREIGN KEY ("A") REFERENCES "Entrenador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PracticaEntrenador" ADD CONSTRAINT "_PracticaEntrenador_B_fkey" FOREIGN KEY ("B") REFERENCES "PracticaDeportiva"("id") ON DELETE CASCADE ON UPDATE CASCADE;
