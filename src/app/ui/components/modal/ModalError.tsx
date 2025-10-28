"use client";

import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import ReportIcon from "@mui/icons-material/WarningAmber";

interface ModalErrorProps {
    open: boolean;
    onClose: () => void;
    tipo?: string;
}

export default function ModalError({
    open,
    onClose,
    tipo = "usuario",
}: ModalErrorProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 2,
                },
            }}
        >
            <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
                <ReportIcon
                    sx={{
                        fontSize: 60,
                        color: "error.main",
                        mb: 1,
                    }}
                />
            </DialogTitle>

            <DialogContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold" color="error.main">
                    ¡Error al buscar DNI!
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    No se encontró el {tipo.toLowerCase()} con el DNI ingresado.
                    Por favor, verifica los datos e inténtalo nuevamente.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        px: 4,
                        borderRadius: 2,
                        backgroundColor: "#d32f2f",
                        "&:hover": {
                            backgroundColor: "#9a0007",
                        },
                        color: "white",
                        fontWeight: "bold",
                    }}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
