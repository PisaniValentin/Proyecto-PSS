import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";
import { Rol, TipoPlan, EstadoSocio } from "@prisma/client";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ dni: string }> }) {
    const { dni } = await params;

    if (!dni) {
        return NextResponse.json({ error: 'Falta o es inválido el dni del usuario' }, { status: 400 })
    }
    try {
        const socio = await prisma.socio.findFirst({
            where: { usuario: { dni } },
            include: {
                usuario: true,
                familia: true,
                pagos: true,
                alquileres: true,
                asistencias: true,
                CuotaSocio: true,
                inscripciones: {
                    include: { practica: true },
                },
            },
        });

        if (!socio) {
            return NextResponse.json({ error: "Socio no encontrado" }, { status: 404 });
        }

        return NextResponse.json(socio, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al obtener el socio" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ dni: string }> }) {
    const { dni } = await params;

    if (!dni) {
        return NextResponse.json({ error: 'Falta o es inválido el dni del usuario' }, { status: 400 })
    }
    try {
        const data = await req.json();
        const { nombre, apellido, email, telefono, password, tipoPlan, estado, familiaId } =
            data;

        const socio = await prisma.socio.findFirst({
            where: { usuario: { dni } },
            include: { usuario: true },
        });

        if (!socio) {
            return NextResponse.json({ error: "Socio no encontrado" }, { status: 404 });
        }

        if (tipoPlan && !Object.values(TipoPlan).includes(tipoPlan)) {
            return NextResponse.json(
                { error: "Tipo de plan inválido" },
                { status: 400 }
            );
        }

        if (estado && !Object.values(EstadoSocio).includes(estado)) {
            return NextResponse.json(
                { error: "Estado inválido" },
                { status: 400 }
            );
        }

        if (familiaId) {
            const familia = await prisma.familia.findUnique({
                where: { id: familiaId },
            });
            if (!familia) {
                return NextResponse.json(
                    { error: "Familia no encontrada" },
                    { status: 400 }
                );
            }
        }

        {/* Hash del nuevo password (solo si cambia)
        const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : socio.usuario.password;
        */}

        const socioActualizado = await prisma.socio.update({
            where: { id: socio.id },
            data: {
                tipoPlan: tipoPlan ?? socio.tipoPlan,
                estado: estado ?? socio.estado,
                familia: familiaId
                    ? { connect: { id: familiaId } }
                    : { disconnect: true },
                usuario: {
                    update: {
                        nombre: nombre ?? socio.usuario.nombre,
                        apellido: apellido ?? socio.usuario.apellido,
                        email: email ?? socio.usuario.email,
                        telefono: telefono ?? socio.usuario.telefono,
                        password: password ?? socio.usuario.password,//hasedPassword,
                        rol: Rol.SOCIO,
                    },
                },
            },
            include: {
                usuario: true,
                familia: true,
            },
        });

        return NextResponse.json(socioActualizado, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al actualizar el socio" },
            { status: 500 }
        );
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ dni: string }> }) {
    const { dni } = await params;
    if (!dni) {
        return NextResponse.json({ error: 'Falta o es inválido el dni del usuario' }, { status: 400 })
    }

    try {
        const socio = await prisma.socio.findFirst({
            where: { usuario: { dni: dni } },
            include: { usuario: true },
        });

        if (!socio) {
            return NextResponse.json({ error: "Socio no encontrado" }, { status: 404 });
        }

        await prisma.socio.delete({ where: { id: socio.id } });
        await prisma.usuario.delete({ where: { dni: socio.usuarioDni } });

        return NextResponse.json({ message: "Socio eliminado correctamente" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al eliminar el socio" },
            { status: 500 }
        );
    }
}
