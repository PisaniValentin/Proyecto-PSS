import  prisma  from "@/app/lib/prisma";
import { successResponse, errorResponse } from "@/app/lib/responses";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const practicas = await prisma.practicaDeportiva.findMany();
        return successResponse(practicas);
    } catch (error) {
        console.error(error);
        return errorResponse("Error al obtener las prácticas deportivas", 500);
    }
}

//Probablemente inscripciones,asistencias y horarios se inicialicen vacios y se agreguen en el UPDATE
export async function POST(request: NextRequest) {
    try{
        const data = await request.json();
        const { deporte, precio, inscripciones, asistencia, horarios } = data;
        const nuevaPractica = await prisma.practicaDeportiva.create({
            data: { deporte, precio, inscripciones, asistencia, horarios },
        });
        return successResponse(nuevaPractica);
    } catch (error) {
        console.error(error);
        return errorResponse("Error al crear la práctica deportiva", 500); 
    }
}