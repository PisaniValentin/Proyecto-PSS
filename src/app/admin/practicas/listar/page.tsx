"use client";

import React, { useState } from "react";
import { Box, Button, Container, List } from "@mui/material";
import ListCard from "@/app/ui/components/practicaCard";
import { useRouter } from "next/navigation";
import ModalModificarPractica from "@/app/ui/components/modal/ModalModificarPractica";
import ModalEliminarPractica from "@/app/ui/components/modal/ModalEliminarPractica";

export default function ListarPracticaDeportiva() {
    const router = useRouter();

    const [openModificar, setOpenModificar] = useState(false);
    const [openEliminar, setOpenEliminar] = useState(false);

    const handleDelete = () => {
        setOpenEliminar(true);
    };

    const handleModify = () => {
        setOpenModificar(true);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                    {Array.from({ length: 20 }).map((_, index) => (
                        <li key={`section-${index}`}>
                            <ListCard
                                key={index}
                                tipoPractica="Cancha asignada"
                                canchaAsignada={`Cancha ${index + 1}`}
                                diasAsignados="Lunes, Miércoles"
                                horarioInicio="10:00"
                                profesorAsignado={`Prof. ${index + 1}`}
                                onDelete={handleDelete}
                                onModify={handleModify}
                            />
                        </li>
                    ))}
                </List>

                {/* Modal de Modificación */}
                <ModalModificarPractica
                    open={openModificar}
                    onClose={() => setOpenModificar(false)}
                />

                {/* Modal de Eliminación */}
                <ModalEliminarPractica
                    open={openEliminar}
                    onClose={() => setOpenEliminar(false)}
                    onDelete={() => {
                        console.log("Práctica eliminada");
                        setOpenEliminar(false);
                    }}
                    deporte="Fútbol"
                    fechaInicio="2025-10-10"
                    fechaFin="2025-12-10"
                    dias="Lunes, Miércoles"
                    horarios="10:00 - 12:00"
                    cancha="Cancha 1"
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => router.push("/admin")}
                        sx={{
                            backgroundColor: "#222222",
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
