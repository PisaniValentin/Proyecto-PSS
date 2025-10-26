"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import ModalExitoPractica from "./ModalExitoPractica";

interface ModalModificarPracticaProps {
    open: boolean;
    onClose: () => void;
    id: string;
}

interface PracticaForm {
    deporte: string;
    canchaId: number | "";
    fechaInicio: string;
    fechaFin: string;
    precio: number;
}

export default function ModalModificarPractica({ open, onClose, id }: ModalModificarPracticaProps) {
    const [formData, setFormData] = useState<PracticaForm>({
        deporte: "",
        canchaId: "",
        fechaInicio: "",
        fechaFin: "",
        precio: 0,
    });
    const [loading, setLoading] = useState(false);
    const [openExito, setOpenExito] = useState(false);
    const [canchas, setCanchas] = useState<{ id: number; nombre: string }[]>([]);

    useEffect(() => {
        if (!open || !id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const resPractica = await fetch(`/api/practicaDeportiva/${id}`);
                const practica = await resPractica.json();

                const resCanchas = await fetch("/api/cancha");
                const listaCanchas = await resCanchas.json();

                setFormData({
                    deporte: practica.deporte || "",
                    canchaId: practica.canchaId || "",
                    fechaInicio: practica.fechaInicio
                        ? new Date(practica.fechaInicio).toISOString().split("T")[0]
                        : "",
                    fechaFin: practica.fechaFin
                        ? new Date(practica.fechaFin).toISOString().split("T")[0]
                        : "",
                    precio: practica.precio || 0,
                });

                setCanchas(listaCanchas);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [open, id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "precio" ? Number(value) : value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch(`/api/practicaDeportiva/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    deporte: formData.deporte,
                    canchaId: formData.canchaId,
                    fechaInicio: formData.fechaInicio,
                    fechaFin: formData.fechaFin,
                    precio: formData.precio,
                }),
            });

            if (!res.ok) throw new Error("Error al actualizar la práctica");

            setOpenExito(true);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error al actualizar la práctica deportiva");
        }
    };

    if (loading) {
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 6 }}>
                    <CircularProgress />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Modificar práctica deportiva</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Deporte"
                        name="deporte"
                        value={formData.deporte}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        select
                        label="Cancha"
                        name="canchaId"
                        value={formData.canchaId}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    >
                        <MenuItem value="">Seleccione una cancha</MenuItem>
                        {canchas.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                                {c.nombre}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Fecha de inicio"
                        name="fechaInicio"
                        type="date"
                        value={formData.fechaInicio}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Fecha de finalización"
                        name="fechaFin"
                        type="date"
                        value={formData.fechaFin}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
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
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Guardar cambios
                    </Button>
                </DialogActions>
            </Dialog>

            <ModalExitoPractica open={openExito} onClose={() => setOpenExito(false)} />
        </>
    );
}
