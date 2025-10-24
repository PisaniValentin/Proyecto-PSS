"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, Grid, Button, Typography } from "@mui/material";

export default function PracticaDeportivaAdmin() {
    const router = useRouter();

    return (
        <Box
            sx={{
                minHeight: "100%",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Grid container spacing={4} justifyContent="center">
                <Grid>
                    <Button
                        onClick={() => router.push("/admin/practicas/alta")}
                        variant="contained"
                        color="primary"
                        sx={{
                            width: 250,
                            height: 180,
                            backgroundColor: "#222222",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 3,
                            boxShadow: 4,
                            "&:hover": { transform: "scale(1.05)" },
                        }}
                    >
                        <img
                            src="/add.png"
                            alt="Agregar práctica deportiva"
                            style={{ height: 80, marginBottom: 10 }}
                        />
                        <Typography variant="h6" fontWeight="bold">
                            Alta Práctica Deportiva
                        </Typography>
                    </Button>
                </Grid>

                <Grid>
                    <Button
                        onClick={() => router.push("/admin/practicas/listar")}
                        variant="contained"

                        sx={{
                            width: 250,
                            height: 180,
                            backgroundColor: "#222222",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 3,
                            boxShadow: 4,
                            "&:hover": { transform: "scale(1.05)" },
                        }}
                    >
                        <img
                            src="/sports.png"
                            alt="Listar prácticas"
                            style={{ height: 80, marginBottom: 10 }}
                        />
                        <Typography variant="h6" fontWeight="bold">
                            Listar Prácticas Deportivas
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
