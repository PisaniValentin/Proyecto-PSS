"use client";
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Button, MenuItem } from "@mui/material";
import { UsuarioBase, Administrativo, Entrenador, Socio } from "@/app/lib/types";

interface ModalCrearProps<T extends UsuarioBase> {
    open: boolean;
    onClose: () => void;
    tipo: string;
    onCrear: (usuario: T) => void;
}

export default function ModalCrear<T extends UsuarioBase>({ open, onClose, tipo, onCrear }: ModalCrearProps<T>) {
    const [form, setForm] = useState<Partial<T>>({} as Partial<T>);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (key: keyof T, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const crearUsuario = async () => {
        setLoading(true);
        setError(null);
        try {
            let url = "";
            let body: any = { ...form };

            if (tipo === "Administrativo") {
                url = "/api/usuario";
                body.rol = "ADMIN";
            } else if (tipo === "Socio") {
                url = "/api/socio";
                body.tipoPlan = (form as Partial<Socio>).tipoPlan;
            } else if (tipo === "Entrenador") {
                url = "/api/entrenador";
                body.practicaId = Number((form as Partial<Entrenador>).practicaId);
            } else {
                throw new Error("Tipo de usuario no válido");
            }

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Error al crear usuario");

            onCrear(data);
            setForm({} as Partial<T>);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Crear {tipo}</DialogTitle>
            <DialogContent dividers>
                <Grid container direction="column" spacing={2}>
                    <Grid><TextField fullWidth label="Nombre" value={form.nombre || ""} onChange={e => handleChange("nombre", e.target.value)} /></Grid>
                    <Grid><TextField fullWidth label="Apellido" value={form.apellido || ""} onChange={e => handleChange("apellido", e.target.value)} /></Grid>
                    <Grid><TextField fullWidth label="DNI" value={form.dni || ""} onChange={e => handleChange("dni", e.target.value)} /></Grid>
                    <Grid><TextField fullWidth label="Email" value={form.email || ""} onChange={e => handleChange("email", e.target.value)} /></Grid>
                    <Grid><TextField fullWidth label="Teléfono" value={form.telefono || ""} onChange={e => handleChange("telefono", e.target.value)} /></Grid>
                    <Grid><TextField fullWidth label="Contraseña" type="password" onChange={e => handleChange("password" as any, e.target.value)} /></Grid>

                    {tipo === "Socio" && (
                        <>
                            <Grid>
                                <TextField
                                    select
                                    fullWidth
                                    label="Tipo de Plan"
                                    value={(form as Partial<Socio>).tipoPlan || ""}
                                    onChange={e => handleChange("tipoPlan" as any, e.target.value)}
                                >
                                    <MenuItem value="INDIVIDUAL">INDIVIDUAL</MenuItem>
                                    <MenuItem value="FAMILIAR">FAMILIAR</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid>
                                <TextField
                                    select
                                    fullWidth
                                    label="Estado"
                                    value={(form as Partial<Socio>).estado || ""}
                                    onChange={e => handleChange("estado" as any, e.target.value)}
                                >
                                    <MenuItem value="ACTIVO">ACTIVO</MenuItem>
                                    <MenuItem value="INACTIVO">INACTIVO</MenuItem>
                                    <MenuItem value="BLOQUEADO">BLOQUEADO</MenuItem>
                                </TextField>
                            </Grid>
                        </>
                    )}

                    {tipo === "Entrenador" && (
                        <Grid>
                            <TextField
                                fullWidth
                                label="ID Práctica Deportiva"
                                type="number"
                                value={(form as Partial<Entrenador>).practicaId || ""}
                                onChange={e => handleChange("practicaId" as any, Number(e.target.value))}
                            />
                        </Grid>
                    )}

                    {error && <Grid><p style={{ color: "red" }}>{error}</p></Grid>}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" color="primary" onClick={crearUsuario} disabled={loading}>
                    {loading ? "Creando..." : "Crear"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
