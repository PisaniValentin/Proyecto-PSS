import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Rol, TipoPlan } from "@prisma/client";
//import bcrypt from "bcrypt";


export async function GET() {
    try {
        const socios = await prisma.socio.findMany({
            include: {
                usuario: true,
                familia: true,
                pagos: true,
                inscripciones: true,
                alquileres: true,
                asistencias: true,
                CuotaSocio: true,
            },
        });

        return NextResponse.json(socios, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al obtener los socios" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const {
            nombre,
            apellido,
            dni,
            email,
            telefono,
            password,
            tipoPlan,
            familiaId,
        } = data;

        if (!nombre || !apellido || !dni || !email || !password || !tipoPlan) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        if (!Object.values(TipoPlan).includes(tipoPlan)) {
            return NextResponse.json(
                { error: "Tipo de plan inválido" },
                { status: 400 }
            );
        }

        if (tipoPlan === TipoPlan.FAMILIAR) {
            if (!familiaId) {
                return NextResponse.json(
                    { error: "Se debe seleccionar una familia para plan grupo familiar" },
                    { status: 400 }
                );
            }

            const familia = await prisma.familia.findUnique({ where: { id: familiaId } });
            if (!familia) {
                return NextResponse.json(
                    { error: "Familia no encontrada" },
                    { status: 400 }
                );
            }
        }

        const existente = await prisma.usuario.findFirst({
            where: { OR: [{ dni }, { email }] },
        });

        if (existente) {
            return NextResponse.json(
                { error: "El DNI o el email ya están registrados" },
                { status: 400 }
            );
        }

        //const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoSocio = await prisma.socio.create({
            data: {
                tipoPlan,
                usuario: {
                    create: {
                        nombre,
                        apellido,
                        dni,
                        email,
                        telefono,
                        password,//:hasedPassword
                        rol: Rol.SOCIO,
                    },
                },
                ...(tipoPlan === TipoPlan.FAMILIAR && familiaId
                    ? { familia: { connect: { id: familiaId } } }
                    : {}),
            },
            include: {
                usuario: true,
                familia: true,
            },
        });

        return NextResponse.json(nuevoSocio, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al crear el socio" },
            { status: 500 }
        );
    }
}
