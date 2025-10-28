"use client";

import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Divider } from "@mui/material";
import GestionEntidad from "@/app/ui/components/GestionEntidad";
import ListaUsuarios from "@/app/ui/components/ListaUsuarios";

export default function Page() {
    const [tab, setTab] = useState(0);
    const [reloadLista, setReloadLista] = useState(false);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const triggerReload = () => setReloadLista(prev => !prev);

    const tipo =
        tab === 0 ? "Administrativo" :
            tab === 1 ? "Socio" :
                "Entrenador";

    return (
        <div className="flex h-screen bg-[#F3F4F6]">
            <div className="flex-1 flex flex-col overflow-auto rounded-2xl border-2 border-[#2A384B]">
                <Box className="p-8">
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            mb: 3,
                            color: "#1F2937",
                            textAlign: "center",
                            textTransform: "uppercase"
                        }}
                    >
                        Gestión de Cuentas
                    </Typography>

                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        sx={{
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#2A384B",
                            },
                            "& .MuiTab-root": {
                                color: "#555",
                                "&.Mui-selected": {
                                    color: "#2A384B",
                                },
                            },
                        }}
                    >
                        <Tab label="Administrativos" />
                        <Tab label="Socios" />
                        <Tab label="Entrenadores" />
                    </Tabs>

                    <GestionEntidad tipo={tipo} onSuccess={triggerReload} />

                    <Divider sx={{ my: 4 }} />

                    <Typography
                        variant="h6"
                        sx={{ mb: 3, color: "#1F2937", textAlign: "center", textTransform: "uppercase", fontWeight: "bold" }}
                    >
                        Lista de {tipo === "Entrenador" ? `${tipo}es` : `${tipo}s`}

                    </Typography>

                    <ListaUsuarios tipo={tipo} reload={reloadLista} />
                </Box>
            </div>
        </div>
    );
}
