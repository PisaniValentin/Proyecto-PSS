"use client";
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";

interface ModalEliminarConfirmProps {
    open: boolean;
    onClose: () => void;
    usuario: any;
    onConfirm: () => void;
    tipo?: string;
}

export default function ModalEliminarConfirm({
    open,
    onClose,
    usuario,
    onConfirm,
    tipo = "usuario",
}: ModalEliminarConfirmProps) {
    const [loading, setLoading] = useState(false);

    const Eliminar = async () => {
        setLoading(true);
        try {
            let endpoint = "";
            const dni = usuario.dni;

            if (tipo === "Administrativo") {
                endpoint = `/api/usuario/${dni}`;
            } else if (tipo === "Entrenador") {
                endpoint = `/api/entrenador/${dni}`;
            } else if (tipo === "Socio") {
                endpoint = `/api/socio/${dni}`;
            } else {
                console.error("Tipo de usuario no soportado");
                setLoading(false);
                return;
            }

            const res = await fetch(endpoint, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.error || "Error al eliminar usuario");
                setLoading(false);
                return;
            }

            onConfirm();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent dividers>
                <Typography>
                    ¿Está seguro que desea eliminar al {tipo ? tipo.toLowerCase() : "usuario"} {usuario?.nombre} {usuario?.apellido}?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" color="error" onClick={Eliminar} disabled={loading}>
                    {loading ? "Eliminando..." : "Eliminar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
