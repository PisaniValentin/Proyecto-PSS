import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ socioId: string; practicaId: string }> }
) {
  try {
    // 🔹 Esperar a que se resuelvan los params
    const { socioId, practicaId } = await context.params;

    if (!socioId || !practicaId) {
      return NextResponse.json(
        { error: "Faltan parámetros socioId o practicaId." },
        { status: 400 }
      );
    }

    // 🔹 Eliminar la inscripción según socioId y practicaId
    const inscripcion = await prisma.inscripcionDeportiva.deleteMany({
      where: {
        socioId: Number(socioId),
        practicaId: Number(practicaId),
      },
    });

    if (inscripcion.count === 0) {
      return NextResponse.json(
        { error: "No se encontró la inscripción." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Inscripción eliminada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar la inscripción:", error);
    return NextResponse.json(
      { error: "Error interno al eliminar la inscripción." },
      { status: 500 }
    );
  }
}
