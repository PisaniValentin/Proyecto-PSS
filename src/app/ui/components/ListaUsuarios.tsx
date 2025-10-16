"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
} from "@mui/material";

interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono?: string;
    rol: string;
}

interface Props {
    tipo: "Administrativo" | "Socio" | "Entrenador";
    reload?: boolean;
}

export default function ListaUsuarios({ tipo, reload }: Props) {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                setLoading(true);
                setError(null);

                const rol =
                    tipo === "Administrativo"
                        ? "ADMIN"
                        : tipo === "Entrenador"
                            ? "ENTRENADOR"
                            : "SOCIO";

                const res = await fetch(`/api/usuario?rol=${rol}`);
                if (!res.ok) {
                    throw new Error(`Error HTTP ${res.status}`);
                }

                const data = await res.json();
                setUsuarios(data);
            } catch (err) {
                console.error("Error al obtener usuarios:", err);
                setError("Error al obtener los usuarios");
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, [tipo, reload]);

    if (loading)
        return (
            <div className="flex justify-center py-6">
                <CircularProgress />
            </div>
        );

    if (error)
        return (
            <Typography color="error" textAlign="center">
                {error}
            </Typography>
        );

    if (usuarios.length === 0)
        return (
            <Typography textAlign="center" color="text.secondary" sx={{ mt: 3 }}>
                No hay usuarios registrados en esta categoría.
            </Typography>
        );

    return (
        <TableContainer component={Paper} elevation={3}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Nombre</strong></TableCell>
                        <TableCell><strong>Apellido</strong></TableCell>
                        <TableCell><strong>DNI</strong></TableCell>
                        <TableCell><strong>Email</strong></TableCell>
                        <TableCell><strong>Teléfono</strong></TableCell>
                        <TableCell><strong>Rol</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {usuarios.map((u) => (
                        <TableRow key={u.id}>
                            <TableCell>{u.nombre}</TableCell>
                            <TableCell>{u.apellido}</TableCell>
                            <TableCell>{u.dni}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.telefono || "-"}</TableCell>
                            <TableCell>{u.rol}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
