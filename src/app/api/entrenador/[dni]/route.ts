import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Rol } from "@prisma/client";

export async function GET(
    req: Request,
    { params }: { params: { dni: string } }
) {
    try {
        const entrenador = await prisma.entrenador.findFirst({
            where: { usuario: { dni: params.dni } },
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

export async function PUT(
    req: Request,
    { params }: { params: { dni: string } }
) {
    try {
        const data = await req.json();
        const { nombre, apellido, email, telefono, password, practicaId } = data;

        const entrenador = await prisma.entrenador.findFirst({
            where: { usuario: { dni: params.dni } },
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
                practica: {
                    connect: { id: practicaId ?? entrenador.practicaId },
                },
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

export async function DELETE(
    req: Request,
    { params }: { params: { dni: string } }
) {
    try {
        const entrenador = await prisma.entrenador.findFirst({
            where: { usuario: { dni: params.dni } },
            include: { usuario: true },
        });

        if (!entrenador) {
            return NextResponse.json(
                { error: "Entrenador no encontrado" },
                { status: 404 }
            );
        }

        await prisma.entrenador.delete({ where: { id: entrenador.id } });
        await prisma.usuario.delete({ where: { id: entrenador.usuarioId } });

        return NextResponse.json({ message: "Entrenador eliminado correctamente" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al eliminar el entrenador" },
            { status: 500 }
        );
    }
}
