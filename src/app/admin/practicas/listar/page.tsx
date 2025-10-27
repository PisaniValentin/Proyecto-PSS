"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Container, Fade, List, Typography } from "@mui/material";
import ListCard from "@/app/ui/components/practicaCard";
import { useRouter } from "next/navigation";
import ModalModificarPractica from "@/app/ui/components/modal/ModalModificarPractica";
import ModalEliminarPractica from "@/app/ui/components/modal/ModalEliminarPractica";
import { HorarioPractica, PracticaDeportiva } from "@/app/lib/types";
import { DiaSemana } from "@prisma/client";


export default function ListarPracticaDeportiva() {
    const router = useRouter();

    const [openModificar, setOpenModificar] = useState(false);
    const [openEliminar, setOpenEliminar] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedPractica, setSelectedPractica] = useState<PracticaDeportiva | null>(null);
    const [practicas, setPracticas] = useState<PracticaDeportiva[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPracticas = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/practicaDeportiva");
            if (!res.ok) throw new Error("Error al obtener las prácticas");

            const data = await res.json();
            setPracticas(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (practica: PracticaDeportiva) => {
        setSelectedPractica(practica);
        setOpenEliminar(true);
    };

    const handleModify = (id: string) => {
        setSelectedId(id);
        setOpenModificar(true);
    };

    function formatHorarios(horarios: HorarioPractica[]): string {
        const diasOrden: Record<DiaSemana, number> = {
            LUNES: 1,
            MARTES: 2,
            MIERCOLES: 3,
            JUEVES: 4,
            VIERNES: 5,
            SABADO: 6,
            DOMINGO: 7,
        };

        return horarios
            .sort((a, b) => diasOrden[a.dia] - diasOrden[b.dia])
            .map((h) => `${h.dia} ${h.horaInicio} – ${h.horaFin}`)
            .join(", ");
    }

    useEffect(() => {
        fetchPracticas()
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {loading ? (
                    <Fade in={loading} timeout={500}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "60vh",
                                gap: 2,
                            }}
                        >
                            <CircularProgress size={60} thickness={4} />
                            <Typography variant="h6" sx={{ color: "#555" }}>
                                Cargando prácticas deportivas...
                            </Typography>
                        </Box>
                    </Fade>
                ) : (
                    <Fade in={!loading} timeout={700}>
                        <List
                            sx={{
                                maxHeight: "70vh",
                                overflowY: "auto",
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                padding: 2,
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            {practicas.length > 0 ? (
                                practicas.map((p) => (
                                    <li key={p.id}>
                                        <ListCard
                                            key={p.id}
                                            id={p.id}
                                            tipoPractica={`${p.deporte}`}
                                            canchaAsignada={`${p.cancha.nombre}`}
                                            horarioAsignado={formatHorarios(p.horarios)}
                                            profesorAsignado={p.entrenadores
                                                .map(
                                                    (e: any) =>
                                                        `${e.usuario?.nombre} ${e.usuario?.apellido}`
                                                )
                                                .join(", ")}
                                            precioAsignado={p.precio}
                                            onDelete={() => handleDelete(p)}
                                            onModify={() => handleModify(String(p.id))}
                                        />
                                    </li>
                                ))
                            ) : (
                                <Typography textAlign="center" sx={{ color: "#777", py: 4 }}>
                                    No hay prácticas registradas.
                                </Typography>
                            )}
                        </List>
                    </Fade>
                )}

                <ModalModificarPractica
                    open={openModificar}
                    onClose={() => setOpenModificar(false)}
                    id={selectedId ?? ""}
                />

                <ModalEliminarPractica
                    open={openEliminar}
                    onClose={() => setOpenEliminar(false)}
                    onDelete={() => {
                        setOpenEliminar(false);
                    }}
                    selectedId={selectedPractica?.id.toString() ?? ""}
                    deporte={selectedPractica?.deporte}
                    fechaInicio={selectedPractica?.fechaInicio}
                    fechaFin={selectedPractica?.fechaFin}
                    dias={selectedPractica?.horarios.map(h => h.dia).join(", ")}
                    horarios={selectedPractica ? formatHorarios(selectedPractica.horarios) : ""}
                    cancha={selectedPractica?.cancha.nombre}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => router.push("/admin")}
                        sx={{
                            backgroundColor: "#222222",
                            "&:hover": {
                                backgroundColor: "#000000"
                            },
                            width: "30%",
                            height: "auto",
                        }}
                    >
                        Volver al menú
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

