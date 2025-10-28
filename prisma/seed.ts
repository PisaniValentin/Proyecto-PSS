import { PrismaClient, DiaSemana } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("🔹 Seed iniciado...");

    // Canchas a las que vamos a agregar horarios
    const canchasIds = [4, 5];

    // Horarios de ejemplo: Lunes a Viernes de 08:00 a 20:00
    const dias: DiaSemana[] = [
        DiaSemana.LUNES,
        DiaSemana.MARTES,
        DiaSemana.MIERCOLES,
        DiaSemana.JUEVES,
        DiaSemana.VIERNES,
    ];

    const horariosToCreate: any[] = [];

    for (const canchaId of canchasIds) {
        for (const dia of dias) {
            // Horario completo de ejemplo: 08:00 - 20:00
            horariosToCreate.push({
                canchaId,
                diaSemana: dia,
                horaInicio: "08:00",
                horaFin: "20:00",
                disponible: true,
            });
        }
    }

    // Insertar horarios en la base de datos
    const result = await prisma.horarioCancha.createMany({
        data: horariosToCreate,
        skipDuplicates: true,
    });

    console.log(`✅ Horarios insertados: ${result.count}`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log("🔹 Seed finalizado correctamente.");
    })
    .catch(async (e) => {
        console.error("❌ Error en el seed:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
