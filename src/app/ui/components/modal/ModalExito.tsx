"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";

interface ModalExitoProps {
    open: boolean;
    onClose: () => void;
    exito: string | null;
    tipo: string;
}

export default function ModalExito({ open, onClose, exito, tipo }: ModalExitoProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Éxito</DialogTitle>
            <DialogContent dividers>
                <Typography>
                    {exito === "modificado"
                        ? `${tipo} modificado con éxito`
                        : `${tipo} eliminado con éxito`}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
}
