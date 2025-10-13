import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { TipoDeporte } from "@prisma/client"; // 👈 ahora existe

// GET /api/cancha
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "1";
    const canchas = await prisma.cancha.findMany({
      where: all ? {} : { activa: true },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(canchas, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/cancha ->", error);
    return NextResponse.json({ error: "Error al obtener las canchas" }, { status: 500 });
  }
}

// POST /api/cancha
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, tipoDeporte, interior, capacidadMax, precioHora } = body;

    if (
      !nombre ||
      !tipoDeporte ||
      interior === undefined ||
      capacidadMax === undefined ||
      precioHora === undefined
    ) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // validar y mapear al enum
    const deporte = String(tipoDeporte).toUpperCase() as keyof typeof TipoDeporte;
    if (!TipoDeporte[deporte]) {
      return NextResponse.json({ error: "Tipo de deporte inválido" }, { status: 400 });
    }

    const nueva = await prisma.cancha.create({
      data: {
        nombre: String(nombre),
        tipoDeporte: TipoDeporte[deporte], // 
        interior: Boolean(interior),
        capacidadMax: Number(capacidadMax),
        precioHora: Number(precioHora),
        activa: true,
      },
    });

    return NextResponse.json(nueva, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/cancha ->", error);
    return NextResponse.json(
      { error: "Error al crear la cancha", details: error?.message },
      { status: 500 }
    );
  }
}
