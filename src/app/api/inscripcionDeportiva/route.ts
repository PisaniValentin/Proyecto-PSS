import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { socioId, practicaId, precioPagado, pagoId } = data;

    // Validaciones básicas
    if (!socioId || !practicaId || !precioPagado) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (socioId, practicaId o precioPagado)" },
        { status: 400 }
      );
    }

    // Verificar que socio y práctica existan antes de crear
    const socio = await prisma.socio.findUnique({ where: { id: Number(socioId) } });
    const practica = await prisma.practicaDeportiva.findUnique({ where: { id: Number(practicaId) } });

    if (!socio) {
      return NextResponse.json({ error: "Socio no encontrado" }, { status: 404 });
    }
    if (!practica) {
      return NextResponse.json({ error: "Práctica deportiva no encontrada" }, { status: 404 });
    }

    // Crear la inscripción
    const nuevaInscripcion = await prisma.inscripcionDeportiva.create({
      data: {
        socioId: Number(socioId),
        practicaId: Number(practicaId),
        precioPagado: Number(precioPagado),
        pagoId: pagoId ? Number(pagoId) : null,
      },
      include: {
        socio: true,
        practica: true,
        pago: true,
      },
    });

    return NextResponse.json(nuevaInscripcion, { status: 201 });
  } catch (error) {
    console.error("Error al crear la inscripción:", error);
    return NextResponse.json(
      { error: "Error interno al crear la inscripción" },
      { status: 500 }
    );
  }
}
