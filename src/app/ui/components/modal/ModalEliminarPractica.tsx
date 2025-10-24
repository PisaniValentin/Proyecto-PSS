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
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ModalExitoEliminarPractica from "@/app/ui/components/modal/ModalExitoEliminarPractica";

interface ModalEliminarPracticaProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
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
    deporte,
    fechaInicio,
    fechaFin,
    dias,
    horarios,
    cancha,
}: ModalEliminarPracticaProps) {

    const [openModal, setOpenModal] = useState(false)

    const handleEliminar = () => {
        setOpenModal(true)
        onDelete()
    }

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
                    <WarningAmberIcon sx={{ fontSize: 60, color: "error.main", mb: 1 }} />
                </DialogTitle>

                <DialogContent sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                        ¿Eliminar esta práctica?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Esta acción no se puede deshacer.
                    </Typography>

                    <Box textAlign="left" sx={{ backgroundColor: "#f9f9f9", p: 2, borderRadius: 2 }}>
                        <Typography variant="body2"><b>Deporte:</b> {deporte || "<Deporte>"}</Typography>
                        <Typography variant="body2"><b>Inicio:</b> {fechaInicio || "<Fecha inicio>"}</Typography>
                        <Typography variant="body2"><b>Fin:</b> {fechaFin || "<Fecha fin>"}</Typography>
                        <Typography variant="body2"><b>Días:</b> {dias || "<Días>"}</Typography>
                        <Typography variant="body2"><b>Horarios:</b> {horarios || "<Horarios>"}</Typography>
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
            <ModalExitoEliminarPractica open={openModal} onClose={() => setOpenModal(false)} />
        </>
    );
}
