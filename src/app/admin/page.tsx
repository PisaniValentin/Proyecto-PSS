"use client";

import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
    const { data: session } = useSession();

    const admin = {
        nombre: session?.user?.name || "Administrador",
        email: session?.user?.email || "admin@domain.com",
        rol: "Administrador",
        imagen: "/default-avatar.webp",
    };

    return (
        <div className="flex h-screen bg-[#F3F4F6]">

            <div className="flex-1 flex flex-col overflow-auto">


                <Box className="p-8">
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{ fontWeight: "bold", mb: 2, color: "#1F2937" }}
                    >
                        Dashboard Administrador
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 4, color: "#374151" }}>
                        Bienvenido, <strong>{admin.nombre}</strong>. Aquí podrás gestionar usuarios,
                        socios, prácticas, canchas y pagos del sistema.
                    </Typography>

                    <Card
                        sx={{
                            maxWidth: 400,
                            backgroundColor: "#D4DFE2",
                            boxShadow: 3,
                            borderRadius: 3,
                        }}
                    >
                        <CardContent className="flex flex-col items-center">
                            <Avatar
                                alt={admin?.nombre}
                                src={admin.imagen}
                                sx={{ width: 100, height: 100, mb: 2 }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {admin.nombre}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {admin.email}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 1,
                                    backgroundColor: "#E5E7EB",
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: "12px",
                                    color: "#1F2937",
                                    fontWeight: 500,
                                }}
                            >
                                Rol: {admin.rol}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </div>
        </div>
    );
}
