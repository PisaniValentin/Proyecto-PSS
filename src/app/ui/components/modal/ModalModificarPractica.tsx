"use client";

import React, { useState, ChangeEvent } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
} from "@mui/material";
import ModalExitoPractica from "./ModalExitoPractica";

interface ModalModificarPracticaProps {
    open: boolean;
    onClose: () => void;
}

export default function ModalModificarPractica({ open, onClose }: ModalModificarPracticaProps) {
    const [formData, setFormData] = useState({
        entrenador: "",
        cancha: "",
        fechaInicio: "",
        fechaFinalizacion: "",
        precio: "",
    });

    const [openExito, setOpenExito] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onClose();
        setOpenExito(true);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Modificar Práctica</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Entrenador"
                        name="entrenador"
                        value={formData.entrenador}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    >
                        <MenuItem value="">Seleccione un entrenador</MenuItem>
                        <MenuItem value="Entrenador 1">Entrenador 1</MenuItem>
                        <MenuItem value="Entrenador 2">Entrenador 2</MenuItem>
                    </TextField>

                    <TextField
                        select
                        label="Cancha del entrenamiento"
                        name="cancha"
                        value={formData.cancha}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    >
                        <MenuItem value="">Seleccione una cancha</MenuItem>
                        <MenuItem value="Cancha 1">Cancha 1</MenuItem>
                        <MenuItem value="Cancha 2">Cancha 2</MenuItem>
                    </TextField>

                    <TextField
                        label="Fecha inicio"
                        name="fechaInicio"
                        type="date"
                        value={formData.fechaInicio}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Fecha finalización"
                        name="fechaFinalizacion"
                        type="date"
                        value={formData.fechaFinalizacion}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Precio"
                        name="precio"
                        type="number"
                        value={formData.precio}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <ModalExitoPractica open={openExito} onClose={() => setOpenExito(false)} />
        </>
    );
}
