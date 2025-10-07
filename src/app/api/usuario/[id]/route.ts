import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
    const usuarioId = Number(context.params.id);

    if (!usuarioId || isNaN(usuarioId)) {
        return NextResponse.json({ error: 'Falta o es inválido el id del usuario' }, { status: 400 })
    }
    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                dni: true,
                email: true,
                telefono: true,
                rol: true,
                fechaAlta: true,
            },
        })

        if (!usuario) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }
        return NextResponse.json(usuario, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Error al obtener el usuario con el id brindado" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    const usuarioId = Number(context.params.id);

    if (!usuarioId || isNaN(usuarioId)) {
        return NextResponse.json({ error: 'Falta o es inválido el id del usuario' }, { status: 400 })
    }

    try {
        const data = await req.json();

        const usuarioActualizado = await prisma.usuario.update({
            where: { id: usuarioId },
            data,
            select: {
                id: true,
                nombre: true,
                apellido: true,
                dni: true,
                email: true,
                telefono: true,
                rol: true,
                fechaAlta: true,
            },
        })

        if (!usuarioActualizado) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        return NextResponse.json(usuarioActualizado, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Error al modificar un usuario' }, { status: 500 })
    }
}

export async function DELETE(context: { params: { id: string } }) {
    const usuarioId = Number(context.params.id);

    if (!usuarioId || isNaN(usuarioId)) {
        return NextResponse.json({ error: 'Falta o es inválido el id del usuario' }, { status: 400 })
    }
    try {
        const usuarioExistente = await prisma.usuario.findUnique({ where: { id: usuarioId } })

        if (!usuarioExistente) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }
        await prisma.usuario.delete({ where: { id: usuarioId } })
        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar un usuario' }, { status: 500 })
    }
}