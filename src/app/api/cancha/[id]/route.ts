import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { TipoDeporte } from "@prisma/client"; // si tu schema usa enum

// GET /api/cancha/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const canchaId = Number(id);
  if (!canchaId || Number.isNaN(canchaId)) {
    return NextResponse.json({ error: "Falta o es inválido el id de la cancha" }, { status: 400 });
  }

  try {
    const cancha = await prisma.cancha.findUnique({ where: { id: canchaId } });
    if (!cancha) return NextResponse.json({ error: "Cancha no encontrada" }, { status: 404 });
    return NextResponse.json(cancha, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/cancha/:id ->", error);
    return NextResponse.json(
      { error: "Error al obtener la cancha", details: error?.message },
      { status: 500 }
    );
  }
}

// PUT /api/cancha/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const canchaId = Number(id);
  if (!canchaId || Number.isNaN(canchaId)) {
    return NextResponse.json({ error: "Falta o es inválido el id de la cancha" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { nombre, tipoDeporte, interior, capacidadMax, precioHora, activa } = body;

    const existe = await prisma.cancha.findUnique({ where: { id: canchaId } });
    if (!existe) return NextResponse.json({ error: "Cancha no encontrada" }, { status: 404 });

    let deporte: any = undefined;
    if (tipoDeporte !== undefined) {
      const up = String(tipoDeporte).toUpperCase();
      const permitido = ["FUTBOL", "PADEL", "TENIS", "BASQUET"];
      if (!permitido.includes(up)) {
        return NextResponse.json({ error: "Tipo de deporte inválido" }, { status: 400 });
      }
      // enum o string
      deporte = (TipoDeporte as any)?.[up] ?? up;
    }

    const actualizada = await prisma.cancha.update({
      where: { id: canchaId },
      data: {
        nombre: nombre ?? existe.nombre,
        tipoDeporte: deporte ?? existe.tipoDeporte,
        interior: interior !== undefined ? Boolean(interior) : existe.interior,
        capacidadMax: capacidadMax !== undefined ? Number(capacidadMax) : existe.capacidadMax,
        precioHora: precioHora !== undefined ? Number(precioHora) : existe.precioHora,
        activa: activa !== undefined ? Boolean(activa) : existe.activa,
      },
    });

    return NextResponse.json(actualizada, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/cancha/:id ->", error);
    return NextResponse.json(
      { error: "Error al modificar una cancha", details: error?.message },
      { status: 500 }
    );
  }
}

// DELETE /api/cancha/:id  → BAJA LÓGICA (activa=false)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const canchaId = Number(id);
  if (!canchaId || Number.isNaN(canchaId)) {
    return NextResponse.json({ error: "Falta o es inválido el id de la cancha" }, { status: 400 });
  }

  try {
    const existe = await prisma.cancha.findUnique({ where: { id: canchaId } });
    if (!existe) return NextResponse.json({ error: "Cancha no encontrada" }, { status: 404 });

    const actualizada = await prisma.cancha.update({
      where: { id: canchaId },
      data: { activa: false },
    });

    return NextResponse.json({ ok: true, id: canchaId, activa: actualizada.activa }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/cancha/:id ->", error);
    return NextResponse.json(
      { error: "Error al eliminar (baja lógica) la cancha", details: error?.message },
      { status: 500 }
    );
  }
}
