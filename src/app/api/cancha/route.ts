import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";
import { TipoDeporte } from "@prisma/client";

export async function GET() {
    try {
        const canchas = await prisma.cancha.findMany({
            include: {
                horarios: true,
                TurnoCancha: true,
            },
        });

        return NextResponse.json(canchas, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al obtener las canchas" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const {
            nombre,
            tipoDeporte,
            interior,
            capacidadMax,
            precioHora,
        } = data;

        if (!nombre || !tipoDeporte || !capacidadMax || !precioHora) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        if (!Object.values(TipoDeporte).includes(tipoDeporte)) {
            return NextResponse.json(
                { error: "Tipo de deporte inválido" },
                { status: 400 }
            );
        }

        const nuevaCancha = await prisma.cancha.create({
            data: {
                nombre,
                tipoDeporte: tipoDeporte as TipoDeporte,
                interior: Boolean(interior),
                capacidadMax: Number(capacidadMax),
                precioHora: Number(precioHora),
            },
        });

        return NextResponse.json(nuevaCancha, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al crear el cancha" },
            { status: 500 }
        );
    }
}
