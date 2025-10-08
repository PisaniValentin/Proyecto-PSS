"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";

interface ModalErrorProps {
    open: boolean;
    onClose: () => void;
    tipo?: string;
}

export default function ModalError({ open, onClose, tipo = "usuario" }: ModalErrorProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Error</DialogTitle>
            <DialogContent dividers>
                <Typography>
                    No se encontró el {tipo ? tipo.toLowerCase() : "usuario"} con el DNI ingresado.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
}
