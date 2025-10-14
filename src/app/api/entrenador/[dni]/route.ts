import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";
import { Rol } from "@prisma/client";

export async function GET(_req: NextRequest, context: { params: { dni: string } }) {
    const { dni } = await context.params;

    if (!dni) {
        return NextResponse.json({ error: 'Falta o es inválido el dni del usuario' }, { status: 400 })
    }
    try {
        const entrenador = await prisma.entrenador.findFirst({
            where: { usuario: { dni } },
            include: { usuario: true, practica: true },
        });

        if (!entrenador) {
            return NextResponse.json(
                { error: "Entrenador no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(entrenador, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al obtener el entrenador" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, context: { params: { dni: string } }) {
    const { dni } = await context.params;

    if (!dni) {
        return NextResponse.json({ error: 'Falta o es inválido el dni del usuario' }, { status: 400 })
    }
    try {
        const data = await req.json();
        const { nombre, apellido, email, telefono, password, practicaId } = data;

        const entrenador = await prisma.entrenador.findFirst({
            where: { usuario: { dni } },
            include: { usuario: true },
        });

        if (!entrenador) {
            return NextResponse.json(
                { error: "Entrenador no encontrado" },
                { status: 404 }
            );
        }

        if (practicaId) {
            const practica = await prisma.practicaDeportiva.findUnique({
                where: { id: practicaId },
            });
            if (!practica) {
                return NextResponse.json(
                    { error: "La práctica especificada no existe" },
                    { status: 400 }
                );
            }
        }

        {/*const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : entrenador.usuario.password;*/}

        const entrenadorActualizado = await prisma.entrenador.update({
            where: { id: entrenador.id },
            data: {
                usuario: {
                    update: {
                        nombre: nombre ?? entrenador.usuario.nombre,
                        apellido: apellido ?? entrenador.usuario.apellido,
                        email: email ?? entrenador.usuario.email,
                        telefono: telefono ?? entrenador.usuario.telefono,
                        password: password ?? entrenador.usuario.password,//hasedPassword,
                        rol: Rol.ENTRENADOR,
                    },
                },
                ...(practicaId && { practica: { connect: { id: practicaId } } }),

            },
            include: { usuario: true, practica: true },
        });

        return NextResponse.json(entrenadorActualizado);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al actualizar el entrenador" },
            { status: 500 }
        );
    }
}


export async function DELETE(_req: NextRequest, context: { params: { dni: string } }) {
    const { dni } = await context.params;

    if (!dni) {
        return NextResponse.json({ error: 'Falta o es inválido el dni del usuario' }, { status: 400 })
    }
    try {
        const entrenador = await prisma.entrenador.findFirst({
            where: { usuario: { dni } },
            include: { usuario: true },
        });

        if (!entrenador) {
            return NextResponse.json(
                { error: "Entrenador no encontrado" },
                { status: 404 }
            );
        }

        await prisma.entrenador.delete({ where: { id: entrenador.id } });
        await prisma.usuario.delete({ where: { dni: entrenador.usuarioDni } });

        return NextResponse.json({ message: "Entrenador eliminado correctamente" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al eliminar el entrenador" },
            { status: 500 }
        );
    }
}
