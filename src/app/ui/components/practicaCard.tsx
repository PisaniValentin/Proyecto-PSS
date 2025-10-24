"use client";

import { Box, Button, Card, CardContent, Typography } from "@mui/material";

interface ListCardProps {
    tipoPractica: string;
    canchaAsignada: string;
    diasAsignados: string;
    horarioInicio: string;
    profesorAsignado: string;
    onDelete: () => void;
    onModify: () => void;
}

export default function ListCard({
    tipoPractica,
    canchaAsignada,
    diasAsignados,
    horarioInicio,
    profesorAsignado,
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
                borderRadius: 2,
                boxShadow: 1,
                mb: 2,
            }}
        >
            <CardContent >
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Tipo práctica deportiva</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <em>{tipoPractica}</em>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <em>Cancha asignada</em>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <em>{canchaAsignada}</em>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <em>Días asignados</em>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <em>{diasAsignados}</em>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <em>Horario inicio</em>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <em>{horarioInicio}</em>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <em>Profesor asignado</em>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <em>{profesorAsignado}</em>
                </Typography>
            </CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mr: 1 }}>
                <Button
                    variant="contained"
                    onClick={onDelete}
                    sx={{
                        minWidth: "100px",
                        height: "40px",
                        backgroundColor: "#FF2A00",
                        '&:hover': {
                            backgroundColor: '#FF512E',
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
                        backgroundColor: "gold",
                        '&:hover': {
                            backgroundColor: 'yellow',
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