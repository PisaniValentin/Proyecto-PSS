"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Divider,
    Grid,
} from "@mui/material";
import ErrorIcon from '@mui/icons-material/ErrorOutlineOutlined';


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
            const dni = usuario?.dni;
            let endpoint = "";

            if (tipo === "Administrativo") endpoint = `/api/usuario/${dni}`;
            else if (tipo === "Entrenador") endpoint = `/api/entrenador/${dni}`;
            else if (tipo === "Socio") endpoint = `/api/socio/${dni}`;
            else {
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
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                },
            }}
        >
            <DialogTitle
                sx={{
                    textAlign: "center",
                    bgcolor: "#d32f2f",
                    color: "white",
                    fontWeight: "bold",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                }}
            >
                <ErrorIcon sx={{
                    verticalAlign: "middle",
                    mr: 1,
                    fontSize: 28,

                }} />
                Confirmar eliminación
            </DialogTitle>

            <DialogContent dividers>
                <Typography variant="body1" textAlign="center" mb={2}>
                    ¿Está seguro que desea eliminar al {tipo.toLowerCase()}{" "}
                    <strong>{usuario?.nombre} {usuario?.apellido}</strong>?
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.2,
                        bgcolor: "#f9f9f9",
                        p: 2,
                        borderRadius: 2,
                    }}
                >
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Nombre:
                        </Typography>
                        <Typography fontWeight="bold">{usuario?.nombre || "-"}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Apellido:
                        </Typography>
                        <Typography fontWeight="bold">{usuario?.apellido || "-"}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            DNI:
                        </Typography>
                        <Typography fontWeight="bold">{usuario?.dni || "-"}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Email:
                        </Typography>
                        <Typography fontWeight="bold">{usuario?.email || "-"}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Teléfono:
                        </Typography>
                        <Typography fontWeight="bold">{usuario?.telefono || "-"}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Rol:
                        </Typography>
                        <Typography fontWeight="bold" sx={{ color: "#d32f2f" }}>
                            {usuario?.rol || tipo}
                        </Typography>
                    </Box>
                </Box>

            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", pt: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: "#333",
                        border: "1px solid #ccc",
                        px: 3,
                        borderRadius: 2,
                        "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={Eliminar}
                    disabled={loading}
                    sx={{
                        px: 4,
                        borderRadius: 2,
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#9a0007" },
                    }}
                >
                    {loading ? "Eliminando..." : "Eliminar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
