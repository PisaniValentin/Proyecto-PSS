"use client";
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    Button,
} from "@mui/material";

interface ModalBuscarDNIProps {
    open: boolean;
    onClose: () => void;
    tipo?: string;
    dniInput: string;
    setDniInput: (value: string) => void;
    onBuscar: () => void;
    eliminar?: boolean;
}

export default function ModalBuscarDNI({
    open,
    onClose,
    tipo = "usuario",
    dniInput,
    setDniInput,
    onBuscar,
    eliminar,
}: ModalBuscarDNIProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{eliminar ? `Eliminar ${tipo}` : `Modificar ${tipo}`}</DialogTitle>
            <DialogContent dividers>
                <Typography sx={{ mb: 2 }}>
                    Ingrese el DNI del {tipo ? tipo.toLowerCase() : "usuario"} que desea{" "}
                    {eliminar ? "eliminar" : "modificar"}:
                </Typography>
                <TextField
                    fullWidth
                    label="DNI"
                    variant="outlined"
                    value={dniInput}
                    onChange={(e) => setDniInput(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    variant="contained"
                    color={eliminar ? "error" : "secondary"}
                    onClick={onBuscar}
                >
                    Buscar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
