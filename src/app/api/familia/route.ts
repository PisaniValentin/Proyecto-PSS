import prisma from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
    try {
        const familias = await prisma.familia.findMany({
            include: { socios: true },
        });
        return NextResponse.json(familias);
    } catch (error) {
        console.error("Error al obtener familias:", error);
        return NextResponse.json(
            { error: "Error al obtener las familias" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { apellido, descuento } = data;

        if (!apellido || apellido.trim() === "") {
            return NextResponse.json(
                { error: "El apellido es obligatorio" },
                { status: 400 }
            );
        }

        const nuevaFamilia = await prisma.familia.create({
            data: {
                apellido,
                descuento: descuento ?? 0.0,
            },
        });

        return NextResponse.json(nuevaFamilia, { status: 201 });
    } catch (error) {
        console.error("Error al crear familia:", error);
        return NextResponse.json(
            { error: "Error al crear familia" },
            { status: 500 }
        );
    }
}
