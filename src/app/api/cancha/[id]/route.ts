import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { TipoDeporte, DiaSemana } from "@prisma/client";

// Solo letras A–Z y espacios
const NOMBRE_REGEX = /^[A-Za-z ]+$/;

// Normaliza string UI → enum BD (quita tildes, mayúsculas)
function normalizeEnumKey(s: string) {
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .toUpperCase();                  // mayúsculas
}

// HH:mm
const HHMM = /^\d{2}:\d{2}$/;
const toMin = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const canchaId = Number(id);
  if (isNaN(canchaId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const cancha = await prisma.cancha.findUnique({ where: { id: canchaId } });
  return cancha
    ? NextResponse.json(cancha, { status: 200 })
    : NextResponse.json({ error: "No encontrada" }, { status: 404 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const canchaId = Number(id);
  if (isNaN(canchaId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  try {
    const updateData: any = {};

    // nombre
    if (typeof body.nombre === "string") {
      const nombreTrim = body.nombre.trim();
      if (!nombreTrim || !NOMBRE_REGEX.test(nombreTrim)) {
        return NextResponse.json(
          { error: "Nombre inválido. Solo letras (A–Z) y espacios." },
          { status: 400 }
        );
      }
      updateData.nombre = nombreTrim;
    }

    // tipoDeporte (acepta "FÚTBOL"/"FUTBOL"/etc.)
    if (body.tipoDeporte !== undefined) {
      const key = normalizeEnumKey(body.tipoDeporte); // FUTBOL, BASQUET, ...
      if (!TipoDeporte[key as keyof typeof TipoDeporte]) {
        return NextResponse.json(
          { error: "Tipo de deporte inválido", recibido: body.tipoDeporte },
          { status: 400 }
        );
      }
      updateData.tipoDeporte = key as TipoDeporte;
    }

    // interior / ubicacion (si viene ubicacion, se deduce interior)
    if (typeof body.interior === "boolean") {
      updateData.interior = body.interior;
    } else if (typeof body.ubicacion === "string") {
      const u = normalizeEnumKey(body.ubicacion); // INTERIOR/EXTERIOR
      if (u === "INTERIOR") updateData.interior = true;
      if (u === "EXTERIOR") updateData.interior = false;
    }

    // capacidadMax (desde capacidadMax o capacidadMaxima)
    if (body.capacidadMax !== undefined || body.capacidadMaxima !== undefined) {
      const cap = Number(body.capacidadMax ?? body.capacidadMaxima);
      if (Number.isNaN(cap) || cap < 1) {
        return NextResponse.json(
          { error: "capacidadMax debe ser numérica y >= 1" },
          { status: 400 }
        );
      }
      updateData.capacidadMax = cap;
    }

    // precioHora (desde precioHora o precioPorHora)
    if (body.precioHora !== undefined || body.precioPorHora !== undefined) {
      const precio = Number(body.precioHora ?? body.precioPorHora);
      if (Number.isNaN(precio) || precio < 0) {
        return NextResponse.json(
          { error: "precioHora debe ser numérico y >= 0" },
          { status: 400 }
        );
      }
      updateData.precioHora = precio;
    }

    // dia (acepta "Lunes" o "LUNES")
    if (body.dia !== undefined) {
      const diaKey = normalizeEnumKey(body.dia); // LUNES...
      if (!DiaSemana[diaKey as keyof typeof DiaSemana]) {
        return NextResponse.json(
          { error: "Día inválido", recibido: body.dia },
          { status: 400 }
        );
      }
      updateData.dia = diaKey as DiaSemana;
    }

    // horas
    if (body.horaApertura !== undefined) {
      if (!HHMM.test(String(body.horaApertura))) {
        return NextResponse.json(
          { error: "horaApertura inválida. Usá HH:mm" },
          { status: 400 }
        );
      }
      updateData.horaApertura = String(body.horaApertura);
    }
    if (body.horaCierre !== undefined) {
      if (!HHMM.test(String(body.horaCierre))) {
        return NextResponse.json(
          { error: "horaCierre inválida. Usá HH:mm" },
          { status: 400 }
        );
      }
      updateData.horaCierre = String(body.horaCierre);
    }
    // si se envían ambas, comprobar orden
    if (updateData.horaApertura && updateData.horaCierre) {
      if (toMin(updateData.horaApertura) >= toMin(updateData.horaCierre)) {
        return NextResponse.json(
          { error: "La hora de apertura debe ser menor que la de cierre" },
          { status: 400 }
        );
      }
    }

    // No permitir campos vacíos
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No hay cambios para actualizar" },
        { status: 400 }
      );
    }

    const cancha = await prisma.cancha.update({
      where: { id: canchaId },
      data: updateData,
    });

    return NextResponse.json(cancha, { status: 200 });
  } catch (e: any) {
    console.error("[PUT /api/cancha/:id] ERROR:", e);
    return NextResponse.json(
      { error: "Error al actualizar cancha", details: e?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const canchaId = Number(id);

  try {
    await prisma.cancha.update({
      where: { id: canchaId },
      data: { activa: false },
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Error al eliminar cancha", details: e?.message },
      { status: 500 }
    );
  }
}
