"use client";
import React, { useState } from "react";
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

    const [error, setError] = useState<string>("");

    const validarDNI = (): boolean => {
        if (!dniInput.trim()) {
            setError("El DNI es obligatorio");
            return false;
        }

        if (!/^\d+$/.test(dniInput)) {
            setError("El DNI solo debe contener números");
            return false;
        }

        if (dniInput.length < 7 || dniInput.length > 8) {
            setError("El DNI debe tener entre 7 y 8 dígitos");
            return false;
        }

        setError("");
        return true;
    };

    const handleBuscar = () => {
        if (validarDNI()) {
            onBuscar();
        }
    };

    const limpiarCampos = () => {
        setDniInput("");
        setError("");
        onClose()
    };

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
                    onChange={(e) => {
                        setDniInput(e.target.value);
                        if (error) setError("");
                    }}
                    error={!!error}
                    helperText={error}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={limpiarCampos}>Cancelar</Button>
                <Button
                    variant="contained"
                    color={eliminar ? "error" : "secondary"}
                    onClick={handleBuscar}
                >
                    Buscar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
