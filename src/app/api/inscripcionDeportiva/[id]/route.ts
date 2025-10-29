import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Falta el ID de la inscripción a eliminar." },
        { status: 400 }
      );
    }

    const inscripcion = await prisma.inscripcionDeportiva.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Inscripción eliminada correctamente", inscripcion },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar la inscripción:", error);
    return NextResponse.json(
      { error: "Error al eliminar la inscripción" },
      { status: 500 }
    );
  }
}
