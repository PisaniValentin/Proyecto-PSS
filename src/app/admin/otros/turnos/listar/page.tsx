"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
} from "@mui/material";

interface TurnoCrudo {
    id: number;
    cancha: {
        id: number;
        nombre: string;
        practica: {
            id: number;
            entrenadores: { usuario: { nombre: string; apellido: string } }[];
            horarios: { dia: string; horaInicio: string; horaFin: string }[];
        }[];
    };
    fecha: string;
    horaInicio: string;
    estado: "PRACTICA_DEPORTIVA" | "ALQUILADO" | "LIBRE";
    alquiler: { socio?: { usuario: { dni: string } } }[];
}

interface TurnoFormateado {
    id: number;
    canchaId: number;
    cancha: string;
    fecha: string;
    horaInicio: string;
    estado: "PRACTICA_DEPORTIVA" | "ALQUILADO" | "LIBRE";
    titular: string;
}

export default function TurnosPage() {
    const [turnos, setTurnos] = useState<TurnoFormateado[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                const res = await fetch("/api/turnos", { cache: "no-store" });
                if (!res.ok) throw new Error("Error al obtener turnos");
                const data: TurnoCrudo[] = await res.json();

                const turnosFormateados: TurnoFormateado[] = data.map((t) => {
                    let titular = "—";

                    if (t.estado === "PRACTICA_DEPORTIVA") {
                        const practica = t.cancha.practica.find((p) =>
                            p.horarios.some(
                                (h) =>
                                    h.horaInicio <= t.horaInicio && h.horaFin > t.horaInicio
                            )
                        );
                        const entrenador = practica?.entrenadores[0]?.usuario;
                        if (entrenador) titular = `${entrenador.nombre} ${entrenador.apellido}`;
                    }

                    if (t.estado === "ALQUILADO") {
                        titular = t.alquiler[0]?.socio?.usuario?.dni || "—";
                    }
                    const fecha = new Date(t.fecha);
                    const fechaFormateada = `${fecha.getUTCDate().toString().padStart(2, "0")}/${(fecha.getUTCMonth() + 1).toString().padStart(2, "0")
                        }/${fecha.getUTCFullYear()}`;
                    return {
                        id: t.id,
                        canchaId: t.cancha.id,
                        cancha: t.cancha.nombre,
                        fecha: fechaFormateada,
                        horaInicio: t.horaInicio,
                        estado: t.estado,
                        titular,
                    };
                });

                setTurnos(turnosFormateados);
            } catch (error) {
                console.error("Error al obtener los turnos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTurnos();
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Typography
                variant="h5"
                textAlign={"center"}
                textTransform={"uppercase"}
                fontWeight="bold"
                bgcolor={"#1a222e"}
                color="white"
                sx={{
                    borderTopLeftRadius: "1rem",
                    borderTopRightRadius: "1rem",
                    p: 1
                }}
            >
                Turnos
            </Typography>
            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 600,
                    borderRadius: 0
                }}
            >

                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 200,

                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table stickyHeader >
                        <TableHead>
                            <TableRow >
                                {["ID - Cancha", "Fecha", "Hora Inicio", "Estado", "Titular"].map((header) => (
                                    <TableCell
                                        key={header}
                                        sx={{
                                            backgroundColor: "#3B4D68",
                                            color: "white",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            textTransform: "uppercase",

                                        }}
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{
                            overflowY: "auto",
                            maxHeight: 600,
                        }}>
                            {turnos.length > 0 ? (
                                turnos.map((t, index) => (
                                    <TableRow
                                        key={t.id}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? "#CDD9EA" : "#ffffff",
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: "bold", color: "#1a222e", textAlign: "center" }}>#{t.canchaId} - {t.cancha}</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", color: "#1a222e", textAlign: "center" }}>{t.fecha}</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", color: "#1a222e", textAlign: "center" }}>{t.horaInicio}</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", color: "#1a222e", textAlign: "center" }}>
                                            {t.estado === "PRACTICA_DEPORTIVA"
                                                ? "Práctica Deportiva"
                                                : t.estado === "ALQUILADO"
                                                    ? "Alquilado"
                                                    : "Libre"}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: "bold", color: "#1a222e", textAlign: "center" }}>{t.titular}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No hay turnos registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
        </Box>
    );
}
