"use client";

import { Box, Button, Card, CardContent, Typography } from "@mui/material";

interface ListCardProps {
    id: number;
    tipoPractica: string;
    canchaAsignada: string;
    horarioAsignado: string;
    profesorAsignado: string;
    precioAsignado: number;
    onDelete: () => void;
    onModify: () => void;
}

export default function ListCard({
    id,
    tipoPractica,
    canchaAsignada,
    horarioAsignado,
    profesorAsignado,
    precioAsignado,
    onDelete,
    onModify,
}: ListCardProps) {
    return (
        <Card
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 1,
                border: 1,
                borderColor: "silver",
                backgroundColor: "#DDE4F0",
                borderRadius: 2,
                boxShadow: 1,
                mb: 2,
            }}
        >
            <CardContent >
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Práctica deportiva PD - {id}</strong>
                </Typography>
                <Typography variant="body2" color="text.primary">
                    <strong>Deporte:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" pl={2}>
                    <em>{tipoPractica}</em>
                </Typography>
                <Typography variant="body2" color="text.primary">
                    <strong>Cancha asignada</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" pl={2}>
                    <em>{canchaAsignada}</em>
                </Typography>
                <Typography variant="body2" color="text.primary">
                    <strong>Días y Horario</strong>
                </Typography>

                <Box sx={{ pl: 2 }} component="div" color="text.secondary">
                    {horarioAsignado
                        ? horarioAsignado.split(/[,;]+/).map((h, i) => (
                            <Typography key={i} variant="body2">
                                {h.trim()}
                            </Typography>
                        ))
                        : <Typography variant="body2">&lt;Sin horarios&gt;</Typography>}
                </Box>
                <Typography variant="body2" color="text.primary">
                    <strong>Profesor asignado</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" pl={2}>
                    <em>{profesorAsignado}</em>
                </Typography>
                <Typography variant="body2" color="text.primary">
                    <strong>Precio</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" pl={2}>
                    <em>${precioAsignado}</em>
                </Typography>
            </CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mr: 4 }}>
                <Button
                    variant="contained"
                    onClick={onDelete}
                    sx={{
                        minWidth: "100px",
                        height: "40px",
                        backgroundColor: "#D32F2F",
                        '&:hover': {
                            backgroundColor: '#B71C1C',
                        },
                        fontWeight: "bold",

                    }}
                >
                    Dar de baja
                </Button>
                <Button
                    variant="contained"
                    onClick={onModify}
                    sx={{
                        minWidth: "100px",
                        height: "40px",
                        backgroundColor: "#FBC02D",
                        '&:hover': {
                            backgroundColor: '#F9A825',
                        },
                        color: "black",
                        fontWeight: "bold",

                    }}
                >
                    Modificar
                </Button>
            </Box>
        </Card>
    );
}