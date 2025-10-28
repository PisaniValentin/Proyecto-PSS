import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { socioId: string } }
) {
  try {
    const { socioId } = params;

    const inscripciones = await prisma.inscripcionDeportiva.findMany({
      where: { socioId: Number(socioId) },
      include: {
        practica: {
          include: {
            cancha: true,
            entrenadores: {
              include: { usuario: true },
            },
            horarios: true,
          },
        },
      },
    });

    if (!inscripciones || inscripciones.length === 0) {
      return NextResponse.json(
        { message: "No se encontraron inscripciones para este socio." },
        { status: 404 }
      );
    }

    return NextResponse.json(inscripciones, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las inscripciones:", error);
    return NextResponse.json(
      { error: "Error al obtener las inscripciones" },
      { status: 500 }
    );
  }
}
