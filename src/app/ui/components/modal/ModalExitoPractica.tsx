"use client";

import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/navigation";

interface ModalExitoPracticaProps {
    open: boolean;
    onClose: () => void;
}

export default function ModalExitoPractica({ open, onClose }: ModalExitoPracticaProps) {
    const router = useRouter();

    const handleAccept = () => {
        onClose();
        router.push("/admin/practicas");
    };

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
                <CheckCircleOutlineIcon
                    sx={{ fontSize: 60, color: "success.main", mb: 1 }}
                />
            </DialogTitle>

            <DialogContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold">
                    ¡Práctica modificada con éxito!
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    Los datos de la práctica deportiva se actualizaron correctamente.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                    onClick={handleAccept}
                    variant="contained"
                    color="success"
                    sx={{ px: 4, borderRadius: 2 }}
                >
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
