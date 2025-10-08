"use client";

import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import GestionEntidad from "@/app/ui/components/GestionEntidad";

export default function Page() {
    const [tab, setTab] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (
        <div className="flex h-screen bg-[#F3F4F6]">
            <div className="flex-1 flex flex-col overflow-auto rounded-2xl border-2 border-indigo-600">
                <Box className="p-8 ">
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontWeight: "bold", mb: 3, color: "#1F2937", textAlign: "center", textTransform: "uppercase" }}
                    >
                        Gestión de Cuentas
                    </Typography>

                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{ mb: 3 }}
                    >
                        <Tab label="Administrativos" />
                        <Tab label="Socios" />
                        <Tab label="Entrenadores" />
                    </Tabs>

                    {tab === 0 && <GestionEntidad tipo="Administrativo" />}
                    {tab === 1 && <GestionEntidad tipo="Socio" />}
                    {tab === 2 && <GestionEntidad tipo="Entrenador" />}
                </Box>
            </div>
        </div>
    );
}
