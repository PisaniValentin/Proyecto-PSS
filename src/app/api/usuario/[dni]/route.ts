import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ dni: string }> }) {
    const { dni } = await params;

    if (!dni) {
        return NextResponse.json({ error: 'Falta o es inválido el dni del usuario' }, { status: 400 })
    }
    try {
        const usuario = await prisma.usuario.findUnique({
            where: { dni },
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
        return NextResponse.json({ error: "Error al obtener el usuario con el dni brindado" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ dni: string }> }) {
    const { dni } = await params;

    if (!dni) {
        return NextResponse.json({ error: 'Falta o es inválido el dni del usuario' }, { status: 400 })
    }

    try {
        const data = await req.json();

        const usuarioExistente = await prisma.usuario.findUnique({ where: { dni } });
        if (!usuarioExistente) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const usuarioActualizado = await prisma.usuario.update({
            where: { dni },
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

        return NextResponse.json(usuarioActualizado, { status: 200 })
    } catch (error) {
        console.error("Error al modificar usuario:", error);

        return NextResponse.json({ error: 'Error al modificar un usuario' }, { status: 500 })
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ dni: string }> }) {
    const { dni } = await params;

    if (!dni) {
        return NextResponse.json({ error: 'Falta o es inválido el dni del usuario' }, { status: 400 })
    }
    try {
        const usuarioExistente = await prisma.usuario.findUnique({ where: { dni } })

        if (!usuarioExistente) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }
        await prisma.usuario.delete({ where: { dni } })
        return NextResponse.json({ message: 'Usuario eliminado correctamente' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar un usuario' }, { status: 500 })
    }
}