"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, Grid, Typography } from "@mui/material";

export default function PracticaDeportivaAdmin() {
    const router = useRouter();

    const cards = [
        {
            title: "Alta Práctica Deportiva",
            description: "Crear una nueva práctica deportiva en el sistema.",
            iconSrc: "/add.png",
            onClick: () => router.push("/admin/practicas/alta"),
            gradient: "linear-gradient(135deg, #28a745 0%, #85d98c 100%)",
        },
        {
            title: "Listar Prácticas Deportivas",
            description: "Ver y administrar todas las prácticas deportivas.",
            iconSrc: "/sports.png",
            onClick: () => router.push("/admin/practicas/listar"),
            gradient: "linear-gradient(135deg, #0d6efd 0%, #6ea0ff 100%)",
        },
    ];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                bgcolor: "#f4f6f8",
                py: 6,
                px: 4,
            }}
        >
            <Grid container spacing={6} justifyContent="center">
                {cards.map((card, index) => (
                    <Grid key={index}>
                        <Box
                            onClick={card.onClick}
                            sx={{
                                width: 300,
                                height: 220,
                                borderRadius: 3,
                                background: card.gradient,
                                color: "#ffffff",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                textAlign: "center",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-10px)",
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={card.iconSrc}
                                alt={card.title}
                                sx={{
                                    height: 80,
                                    mb: 2,
                                    filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.2))",
                                    transition: "transform 0.3s ease",
                                    "&:hover": { transform: "scale(1.15)" },
                                }}
                            />
                            <Typography variant="h6" fontWeight="bold">
                                {card.title}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1, px: 3 }}>
                                {card.description}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
