"use client";

import Navbar from "@/app/ui/components/layout/Navbar";
import Sidebar from "@/app/ui/components/layout/Sidebar";
import { Box, Typography, Card, CardContent, CardMedia, Button, CardActions } from "@mui/material";

const actividades = [
    { nombre: "Prácticas Deportivas", imagen: "/images/practicas.jpg" },
    { nombre: "Alquileres", imagen: "/images/alquileres.jpg" },
    { nombre: "Gestión de Cuentas", imagen: "/images/cuentas.jpg" },
    { nombre: "Reportes", imagen: "/images/reportes.jpg" },
    { nombre: "Pagos", imagen: "/images/pagos.jpg" },
    { nombre: "Otro", imagen: "/images/otro.jpg" },
];

export default function AdminDashboard() {
    return (
        <div className="flex h-screen bg-[#F3F4F6]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-auto">
                <Navbar />
                <Box className="p-8">
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2, color: '#1F2937' }}>
                        Dashboard Administrador
                    </Typography>
                    <Typography variant="body1" className="mb-6 text-gray-700">
                        Bienvenido al panel de administración. Aquí podrás gestionar usuarios, socios, prácticas, canchas y pagos.
                    </Typography>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {actividades.map((act) => (
                            <Card
                                key={act.nombre}
                                className="flex flex-col justify-between rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 bg-white"
                            >
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={act.imagen}
                                    alt={act.nombre}
                                    className="rounded-t-xl object-cover"
                                />
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                                        {act.nombre}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Accede a la sección para gestionar {act.nombre.toLowerCase()}.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#000000',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            width: '100%',
                                            '&:hover': { backgroundColor: '#111111' },
                                        }}
                                        onClick={() => alert(`Ir a ${act.nombre}`)}
                                    >
                                        {act.nombre}
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </div>
                </Box>
            </div>
        </div>
    );
}
