import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { TipoDeporte } from "@prisma/client";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const canchaId = Number(id);

    if (!canchaId || isNaN(canchaId)) {
        return NextResponse.json({ error: 'Falta o es inválido el id de la cancha' }, { status: 400 })
    }
    try {
        const cancha = await prisma.cancha.findUnique({
            where: { id: canchaId },
            include: {
                horarios: true,
                TurnoCancha: true,
            },
        })

        if (!cancha) {
            return NextResponse.json({ error: 'Cancha no encontrada' }, { status: 404 })
        }
        return NextResponse.json(cancha, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Error al obtener la cancha con el id brindado" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const canchaId = Number(id);

    if (!canchaId || isNaN(canchaId)) {
        return NextResponse.json({ error: 'Falta o es inválido el id de la cancha' }, { status: 400 })
    }

    try {
        const body = await req.json();
        const { nombre, tipoDeporte, interior, capacidadMax, precioHora, activa } =
            body;

        const canchaExistente = await prisma.cancha.findUnique({
            where: { id: canchaId },
        });

        if (!canchaExistente) {
            return NextResponse.json(
                { error: "Cancha no encontrada" },
                { status: 404 }
            );
        }

        if (tipoDeporte && !Object.values(TipoDeporte).includes(tipoDeporte)) {
            return NextResponse.json(
                { error: "Tipo de deporte inválido" },
                { status: 400 }
            );
        }

        const canchaActualizada = await prisma.cancha.update({
            where: { id: canchaId },
            data: {
                nombre: nombre ?? canchaExistente.nombre,
                tipoDeporte: tipoDeporte ?? canchaExistente.tipoDeporte,
                interior:
                    interior !== undefined ? Boolean(interior) : canchaExistente.interior,
                capacidadMax:
                    capacidadMax !== undefined
                        ? Number(capacidadMax)
                        : canchaExistente.capacidadMax,
                precioHora:
                    precioHora !== undefined
                        ? Number(precioHora)
                        : canchaExistente.precioHora,
                activa: activa ?? canchaExistente.activa,
            },
            include: {
                horarios: true,
                TurnoCancha: true,
            },
        });

        return NextResponse.json(canchaActualizada, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Error al modificar una cancha' }, { status: 500 })
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const canchaId = Number(id);

    if (!canchaId || isNaN(canchaId)) {
        return NextResponse.json({ error: 'Falta o es inválido el id de la cancha' }, { status: 400 })
    }
    try {
        const canchaExistente = await prisma.cancha.findUnique({ where: { id: canchaId } })

        if (!canchaExistente) {
            return NextResponse.json({ error: 'Cancha no encontrada' }, { status: 404 })
        }
        await prisma.cancha.delete({ where: { id: canchaId } })
        return NextResponse.json({ message: "Cancha eliminada correctamente" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar una cancha' }, { status: 500 })
    }
}