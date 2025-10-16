import prisma from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const FamiliaId = Number(id);

    try {
        if (isNaN(FamiliaId))
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });

        const familia = await prisma.familia.findUnique({
            where: { id: FamiliaId },
            include: { socios: true },
        });

        if (!familia)
            return NextResponse.json({ error: "Familia no encontrada" }, { status: 404 });

        return NextResponse.json(familia);
    } catch (error) {
        console.error("Error al obtener familia:", error);
        return NextResponse.json(
            { error: "Error al obtener familia" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const FamiliaId = Number(id);
    try {

        if (isNaN(FamiliaId))
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });

        const data = await req.json();
        const { descuento } = data;

        const familiaActualizada = await prisma.familia.update({
            where: { id: FamiliaId },
            data: {
                descuento: descuento,
            },
        });

        return NextResponse.json(familiaActualizada);
    } catch (error) {
        console.error("Error al actualizar familia:", error);
        return NextResponse.json(
            { error: "Error al actualizar familia" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const FamiliaId = Number(id);
    try {

        if (isNaN(FamiliaId))
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });

        const socios = await prisma.socio.findMany({ where: { familiaId: FamiliaId } });
        if (socios.length > 0) {
            return NextResponse.json(
                { error: "No se puede eliminar una familia con socios asociados" },
                { status: 400 }
            );
        }

        await prisma.familia.delete({ where: { id: FamiliaId } });
        return NextResponse.json({ message: "Familia eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar familia:", error);
        return NextResponse.json(
            { error: "Error al eliminar familia" },
            { status: 500 }
        );
    }
}
