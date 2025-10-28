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
import ModalExitoPractica from "@/app/ui/components/modal/ModalExitoPractica";

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
    precio: number | "";
}

interface FormErrors {
    deporte?: string;
    canchaId?: string;
    fechaInicio?: string;
    fechaFin?: string;
    precio?: string;
}

export default function ModalModificarPractica({ open, onClose, id }: ModalModificarPracticaProps) {
    const [formData, setFormData] = useState<PracticaForm>({
        deporte: "",
        canchaId: "",
        fechaInicio: "",
        fechaFin: "",
        precio: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
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
                    precio: practica.precio || "",
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

    const validateField = (name: string, value: any): string | undefined => {
        switch (name) {
            case "deporte":
                if (!value.trim()) return "El deporte es obligatorio.";
                break;
            case "canchaId":
                if (!value) return "Debe seleccionar una cancha.";
                break;
            case "fechaInicio":
                if (!value) return "Debe ingresar la fecha de inicio.";
                break;
            case "fechaFin":
                if (!value) return "Debe ingresar la fecha de finalización.";
                break;
            case "precio":
                if (value === "" || value === null) return "Debe ingresar un precio.";
                if (Number(value) <= 0) return "El precio debe ser mayor que cero.";
                break;
        }
        return undefined;
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        Object.keys(formData).forEach((key) => {
            const field = key as keyof PracticaForm;
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === "precio" ? Number(value) : value;

        setFormData((prev) => ({
            ...prev,
            [name]: parsedValue,
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const res = await fetch(`/api/practicaDeportiva/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
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
                <DialogTitle textAlign={"center"} bgcolor={"#222222"} color={"white"}>Modificar práctica deportiva</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Deporte"
                        name="deporte"
                        value={formData.deporte}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.deporte)}
                        helperText={errors.deporte}
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
                        onBlur={handleBlur}
                        error={Boolean(errors.canchaId)}
                        helperText={errors.canchaId}
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
                        onBlur={handleBlur}
                        error={Boolean(errors.fechaInicio)}
                        helperText={errors.fechaInicio}
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
                        onBlur={handleBlur}
                        error={Boolean(errors.fechaFin)}
                        helperText={errors.fechaFin}
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
                        onBlur={handleBlur}
                        error={Boolean(errors.precio)}
                        helperText={errors.precio}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            backgroundColor: "#222",
                            "&:hover": { backgroundColor: "#333" },
                        }}
                    >
                        Guardar cambios
                    </Button>
                </DialogActions>
            </Dialog>

            <ModalExitoPractica open={openExito} onClose={() => setOpenExito(false)} opcion="modificada" />
        </>
    );
}
