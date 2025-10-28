import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { TipoDeporte } from "@prisma/client";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Falta el ID de la práctica deportiva" }, { status: 400 });

    try {
        const practica = await prisma.practicaDeportiva.findUnique({
            where: { id: Number(id) },
            include: {
                cancha: true,
                entrenadores: { include: { usuario: true } },
                horarios: true,
            },
        });

        if (!practica) return NextResponse.json({ error: "Práctica deportiva no encontrada" }, { status: 404 });

        return NextResponse.json(practica, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener la práctica deportiva" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Falta el ID de la práctica deportiva" }, { status: 400 });

    try {
        const data = await req.json();
        const { deporte, canchaId, fechaInicio, fechaFin, precio, entrenadorIds } = data;

        const practicaExistente = await prisma.practicaDeportiva.findUnique({ where: { id: Number(id) } });
        if (!practicaExistente) return NextResponse.json({ error: "Práctica no encontrada" }, { status: 404 });

        if (deporte && !Object.values(TipoDeporte).includes(deporte)) {
            return NextResponse.json({ error: "Tipo de deporte inválido" }, { status: 400 });
        }

        if (canchaId) {
            const cancha = await prisma.cancha.findUnique({ where: { id: canchaId } });
            if (!cancha) return NextResponse.json({ error: "La cancha no existe" }, { status: 400 });
        }

        let entrenadoresConnectDisconnect = undefined;
        if (entrenadorIds) {
            const entrenadores = await prisma.entrenador.findMany({
                where: { id: { in: entrenadorIds } },
            });
            if (entrenadores.length !== entrenadorIds.length) {
                return NextResponse.json({ error: "Alguno de los entrenadores no existe" }, { status: 400 });
            }
            entrenadoresConnectDisconnect = {
                set: entrenadorIds.map((id: number) => ({ id })),
            };
        }

        const practicaActualizada = await prisma.practicaDeportiva.update({
            where: { id: Number(id) },
            data: {
                deporte: deporte ?? practicaExistente.deporte,
                canchaId: canchaId ?? practicaExistente.canchaId,
                fechaInicio: fechaInicio ? new Date(fechaInicio) : practicaExistente.fechaInicio,
                fechaFin: fechaFin ? new Date(fechaFin) : practicaExistente.fechaFin,
                precio: precio ?? practicaExistente.precio,
                ...(entrenadoresConnectDisconnect && { entrenadores: entrenadoresConnectDisconnect }),
            },
            include: { entrenadores: true, cancha: true, horarios: true },
        });

        return NextResponse.json(practicaActualizada, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al actualizar la práctica deportiva" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Falta el ID de la práctica deportiva" }, { status: 400 });

    try {
        const practicaExistente = await prisma.practicaDeportiva.findUnique({ where: { id: Number(id) } });
        if (!practicaExistente) return NextResponse.json({ error: "Práctica no encontrada" }, { status: 404 });

        await prisma.practicaDeportiva.update({
            where: { id: Number(id) },
            data: { entrenadores: { set: [] } },
        });

        await prisma.horarioPractica.deleteMany({
            where: { practicaId: Number(id) },
        });

        await prisma.practicaDeportiva.delete({ where: { id: Number(id) } });

        return NextResponse.json({ message: "Práctica deportiva eliminada correctamente" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al eliminar la práctica deportiva" }, { status: 500 });
    }
}
