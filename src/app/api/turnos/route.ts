import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

function normalizarDia(dia: string): string {
    return dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

function sumarUnDia(fecha: Date): Date {
    const nueva = new Date(fecha);
    nueva.setDate(nueva.getDate() + 1);
    return nueva;
}

function fechaUTC(fecha: Date): Date {
    return new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
}

function horaToMinutos(hora: string): number {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
}

export async function POST(req: Request) {
    try {
        const { fechaInicio, fechaFin } = await req.json();

        if (!fechaInicio || !fechaFin) {
            return NextResponse.json(
                { error: "Debe seleccionar fecha de inicio y fin" },
                { status: 400 }
            );
        }

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
            return NextResponse.json(
                { error: "Fechas inválidas" },
                { status: 400 }
            );
        }

        if (fin < inicio) {
            return NextResponse.json(
                { error: "La fecha fin debe ser posterior o igual a la fecha inicio" },
                { status: 400 }
            );
        }

        const canchas = await prisma.cancha.findMany({
            include: {
                horarios: true,
                practica: { include: { horarios: true } },
            },
        });

        if (canchas.length === 0) {
            console.log("No hay canchas registradas en la base de datos");
            return NextResponse.json(
                { message: "No hay canchas configuradas. No se generaron turnos." },
                { status: 200 }
            );
        }

        const turnos: any[] = [];
        let canchasProcesadas = 0;

        for (const cancha of canchas) {
            let turnosCancha = 0;
            for (let fecha = new Date(inicio); fecha <= fin; fecha = sumarUnDia(fecha)) {
                const diaSemana = normalizarDia(
                    fecha.toLocaleDateString("es-AR", { weekday: "long" })
                );

                const horariosDia = cancha.horarios.filter(
                    (h) => h.diaSemana === diaSemana && h.disponible
                );

                if (!horariosDia.length) continue;

                for (const hDia of horariosDia) {
                    const inicioMin = horaToMinutos(hDia.horaInicio);
                    const finMin = horaToMinutos(hDia.horaFin);

                    for (let min = inicioMin; min < finMin; min += 60) {
                        const horaInicioStr = `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
                        const horaFinStr = `${String(Math.floor((min + 60) / 60)).padStart(2, "0")}:${String((min + 60) % 60).padStart(2, "0")}`;

                        const practica = cancha.practica.find((p) =>
                            p.horarios.some((hp) => {
                                if (hp.dia !== diaSemana) return false;
                                const pInicio = horaToMinutos(hp.horaInicio);
                                const pFin = horaToMinutos(hp.horaFin);
                                const tInicio = min;
                                return tInicio >= pInicio && tInicio < pFin;
                            })
                        );

                        const turno = {
                            canchaId: cancha.id,
                            fecha: fechaUTC(fecha),
                            horaInicio: horaInicioStr,
                            horaFin: horaFinStr,
                            estado: practica ? "PRACTICA_DEPORTIVA" : "LIBRE",
                            titularTipo: practica ? "PracticaDeportiva" : null,
                            titularId: practica ? practica.id : null,
                        };

                        turnos.push(turno);
                        turnosCancha++;
                    }
                }
            }
            if (turnosCancha > 0) {
                canchasProcesadas++;
                console.log(`Cancha ${cancha.nombre}: ${turnosCancha} turnos generados`);
            }
        }

        if (turnos.length === 0) {
            return NextResponse.json(
                { message: "No se generaron turnos nuevos. Verifica horarios disponibles o si ya existen." },
                { status: 200 }
            );
        }

        const result = await prisma.turnoCancha.createMany({
            data: turnos,
            skipDuplicates: true,
        });

        return NextResponse.json({
            message: `Turnos generados: ${result.count} nuevos insertados`,
            totalGenerados: turnos.length,
            insertados: result.count,
        });

    } catch (error: any) {
        console.error("Error generando turnos:", error);
        return NextResponse.json(
            { error: "Error interno del servidor", details: error.message },
            { status: 500 }
        );
    }
}