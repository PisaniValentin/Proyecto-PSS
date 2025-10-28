"use client";

import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Box,
} from "@mui/material";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ModalExitoPractica from "@/app/ui/components/modal/ModalExitoPractica";

interface ModalEliminarPracticaProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    selectedId: string;
    deporte?: string;
    fechaInicio?: string;
    fechaFin?: string;
    dias?: string;
    horarios?: string;
    cancha?: string;
}

export default function ModalEliminarPractica({
    open,
    onClose,
    onDelete,
    selectedId,
    deporte,
    fechaInicio,
    fechaFin,
    dias,
    horarios,
    cancha,
}: ModalEliminarPracticaProps) {

    const [openModal, setOpenModal] = useState(false);

    const formatFecha = (fecha?: string) => {
        if (!fecha) return "<Fecha inválida>";
        if (fecha.includes("T")) {
            const date = new Date(fecha);
            if (isNaN(date.getTime())) return "<Fecha inválida>";
            const dia = String(date.getUTCDate()).padStart(2, "0");
            const mes = String(date.getUTCMonth() + 1).padStart(2, "0");
            const anio = date.getUTCFullYear();
            return `${dia}-${mes}-${anio}`;
        }
        const [fechaPart] = fecha.split(" ");
        const [anio, mes, dia] = fechaPart.split("-").map(Number);
        const date = new Date(anio, mes - 1, dia);
        if (isNaN(date.getTime())) return "<Fecha inválida>";
        const diaStr = String(date.getDate()).padStart(2, "0");
        const mesStr = String(date.getMonth() + 1).padStart(2, "0");
        const anioStr = date.getFullYear();
        return `${diaStr}-${mesStr}-${anioStr}`;
    };


    const handleEliminar = async () => {
        if (!deporte || !fechaInicio || !fechaFin) return;
        try {
            const res = await fetch(`/api/practicaDeportiva/${selectedId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error al eliminar la práctica");
            }
            setOpenModal(true);
            onDelete();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "No se pudo eliminar la práctica");
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, p: 2 },
                }}
            >
                <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: 60, color: "error.main", mb: 1 }} />
                </DialogTitle>

                <DialogContent sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                        ¿Eliminar práctica deportiva?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Esta seguro que quiere eliminar la práctica deportiva.
                    </Typography>

                    <Box textAlign="left" sx={{ backgroundColor: "#f9f9f9", p: 2, borderRadius: 2 }}>
                        <Typography variant="body2"><b>Deporte:</b> {deporte || "<Deporte>"}</Typography>
                        <Typography variant="body2"><b>Inicio:</b> {fechaInicio ? formatFecha(fechaInicio) : "<Fecha inicio>"}</Typography>
                        <Typography variant="body2"><b>Fin:</b> {fechaFin ? formatFecha(fechaFin) : "<Fecha fin>"}</Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <b>Días y horarios:</b>
                        </Typography>

                        <Box sx={{ pl: 2 }}>
                            {horarios
                                ? horarios
                                    .split(/[,;]+/)
                                    .map((h, i) => (
                                        <Typography key={i} variant="body2">
                                            {h.trim()}
                                        </Typography>
                                    ))
                                : <Typography variant="body2">&lt;Sin horarios&gt;</Typography>}
                        </Box>
                        <Typography variant="body2"><b>Cancha:</b> {cancha || "<Cancha>"}</Typography>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleEliminar}
                        variant="contained"
                        color="error"
                        sx={{ px: 4, borderRadius: 2 }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
            <ModalExitoPractica open={openModal} onClose={() => setOpenModal(false)} opcion={"elimidada"} />
        </>
    );
}
