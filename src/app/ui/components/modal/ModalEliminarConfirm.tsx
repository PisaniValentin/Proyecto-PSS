"use client";
import React from "react";
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
                <Button variant="contained" color="error" onClick={onConfirm}>Eliminar</Button>
            </DialogActions>
        </Dialog>
    );
}
