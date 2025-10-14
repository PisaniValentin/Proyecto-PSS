// app/api/cancha/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { TipoDeporte, DiaSemana } from "@prisma/client";

export const runtime = "nodejs";
export const revalidate = 0;

// --- helpers ---
const HHMM = /^\d{2}:\d{2}$/;

function isMissing(v: unknown) {
  return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Quita acentos y pasa a MAYÚSCULAS (para mapear enums) */
function upperNoAccents(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase()
    .trim();
}

/** Mapea valores libres → enums de Prisma (tolerante con acentos) */
function mapTipoDeporte(input: unknown): TipoDeporte | null {
  if (typeof input !== "string") return null;
  const k = upperNoAccents(input); // "FÚTBOL" → "FUTBOL"
  return (TipoDeporte as any)[k] ?? null;
}

function mapDiaSemana(input: unknown): DiaSemana | null {
  if (typeof input !== "string") return null;
  const k = upperNoAccents(input); // "Miércoles" → "MIERCOLES"
  return (DiaSemana as any)[k] ?? null;
}

/**
 * GET /api/cancha  → lista todas
 */
export async function GET() {
  try {
    const canchas = await prisma.cancha.findMany({
      where: { activa: true },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(canchas, { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/cancha] ERROR:", error);
    return NextResponse.json(
      { error: "Error al obtener canchas", details: error?.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cancha  → alta (acepta nombres del front y del back)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Aceptamos ambos nombres de campos (front y back)
    const nombre = body?.nombre;
    const tipoDeporteIn = body?.tipoDeporte; // e.g. "FÚTBOL" o "FUTBOL"
    // front: ubicacion: "INTERIOR"/"EXTERIOR" | back: interior: boolean
    const interior: boolean | undefined =
      typeof body?.interior === "boolean"
        ? body.interior
        : typeof body?.ubicacion === "string"
        ? upperNoAccents(body.ubicacion) === "INTERIOR"
        : undefined;

    const capacidadMax = body?.capacidadMax ?? body?.capacidadMaxima;
    const precioHora = body?.precioHora ?? body?.precioPorHora ?? 0;
    const diaIn = body?.dia; // "Lunes" o "LUNES"
    const horaApertura = body?.horaApertura;
    const horaCierre = body?.horaCierre;

    // Validaciones de obligatorios (permitimos precio 0)
    const faltantes: string[] = [];
    if (isMissing(nombre)) faltantes.push("nombre");
    if (interior === undefined) faltantes.push("interior/ubicacion");
    if (isMissing(capacidadMax)) faltantes.push("capacidadMax/capacidadMaxima");
    if (isMissing(diaIn)) faltantes.push("dia");
    if (isMissing(horaApertura)) faltantes.push("horaApertura");
    if (isMissing(horaCierre)) faltantes.push("horaCierre");
    if (isMissing(tipoDeporteIn)) faltantes.push("tipoDeporte");

    if (faltantes.length) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios", fields: faltantes },
        { status: 400 }
      );
    }

    // Enums tolerantes
    const deporte = mapTipoDeporte(tipoDeporteIn);
    if (!deporte) {
      return NextResponse.json(
        {
          error: "Tipo de deporte inválido",
          recibido: tipoDeporteIn,
          validos: Object.keys(TipoDeporte),
        },
        { status: 400 }
      );
    }

    const dia = mapDiaSemana(diaIn);
    if (!dia) {
      return NextResponse.json(
        { error: "Día inválido", recibido: diaIn, validos: Object.keys(DiaSemana) },
        { status: 400 }
      );
    }

    // Números
    const cap = Number(capacidadMax);
    const precio = Number(precioHora);
    if (!Number.isFinite(cap) || cap < 1) {
      return NextResponse.json(
        { error: "capacidadMax/capacidadMaxima inválida", recibido: capacidadMax },
        { status: 400 }
      );
    }
    if (!Number.isFinite(precio) || precio < 0) {
      return NextResponse.json(
        { error: "precioHora/precioPorHora inválido", recibido: precioHora },
        { status: 400 }
      );
    }

    // Horas
    if (!(typeof horaApertura === "string" && HHMM.test(horaApertura)) ||
        !(typeof horaCierre === "string" && HHMM.test(horaCierre))) {
      return NextResponse.json(
        { error: "Formato de hora inválido (usa HH:mm)", recibido: { horaApertura, horaCierre } },
        { status: 400 }
      );
    }
    if (toMinutes(horaApertura) >= toMinutes(horaCierre)) {
      return NextResponse.json(
        { error: "La hora de apertura debe ser menor que la de cierre" },
        { status: 400 }
      );
    }

    // Insert
    const creada = await prisma.cancha.create({
      data: {
        nombre: String(nombre).trim(),
        tipoDeporte: deporte,
        interior: Boolean(interior),
        capacidadMax: cap,
        precioHora: precio,
        activa: true,
        dia,
        horaApertura: String(horaApertura),
        horaCierre: String(horaCierre),
      },
    });

    return NextResponse.json(creada, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/cancha] ERROR:", error);
    return NextResponse.json(
      {
        error: "No se pudo crear la cancha",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
