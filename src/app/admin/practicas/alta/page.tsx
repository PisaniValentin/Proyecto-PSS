"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { TipoDeporte, Usuario, Entrenador, Cancha } from "@prisma/client";

type EntrenadorConUsuario = Entrenador & {
    usuario: {
        dni: string,
        nombre: string,
        apellido: string,
        email: string,
    };
};

const days = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"]

export default function AltaPracticaDeportiva() {

    const router = useRouter();

    const [deporte, setDeporte] = useState("");
    const [entrenadorId, setEntrenadorId] = useState<number | null>(null);
    const [canchaId, setCanchaId] = useState<number | null>(null);
    const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
    const [inicio, setInicio] = useState("");
    const [fin, setFin] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [precio, setPrecio] = useState("");
    const [entrenadores, setEntrenadores] = useState<EntrenadorConUsuario[]>([]);
    const [canchas, setCanchas] = useState<Cancha[]>([]);

    const fetchEntrenadores = async () => {
        try {
            const res = await fetch("/api/entrenador");
            if (!res.ok) throw new Error("Error al obtener entrenadores");
            const data = await res.json();
            setEntrenadores(data);
        } catch (error) {
            console.error("Error al cargar entrenadores:", error);
        }
    };

    const fetchCanchas = async () => {
        try {
            const res = await fetch("/api/cancha");
            if (!res.ok) throw new Error("Error al obtener canchas");
            const data = await res.json();
            setCanchas(data);
        } catch (error) {
            console.error("Error al cargar canchas:", error);
        }
    };

    const handleGuardar = async () => {
        try {
            const payload = {
                deporte,
                canchaId: canchaId,
                fechaInicio,
                fechaFin,
                precio: Number(precio),
                entrenadorIds: entrenadorId ? [Number(entrenadorId)] : [],
                horarios: diasSeleccionados.map((dia) => ({
                    dia,
                    horaInicio: inicio,
                    horaFin: fin,
                })),
            };

            console.log("Payload a enviar:", payload);

            const res = await fetch("/api/practicaDeportiva", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error al crear la práctica");
            }

            const nuevaPractica = await res.json();
            console.log("Práctica creada:", nuevaPractica);

            setDeporte("");
            setEntrenadorId(null);
            setCanchaId(null);
            setDiasSeleccionados([]);
            setInicio("");
            setFin("");
            setFechaInicio("");
            setFechaFin("");
            setPrecio("");

            router.push("/admin/practicas");

        } catch (error) {
            console.error("Error al guardar práctica:", error);
            alert("Ocurrió un error al guardar la práctica");
        }
    };

    useEffect(() => {
        fetchEntrenadores();
        fetchCanchas();
    }, []);

    const entrenadoresFiltrados = entrenadores.filter(
        (e) => e.actividadDeportiva === deporte
    );

    const horaFinOptions = inicio
        ? hours.slice(hours.indexOf(inicio) + 1)
        : hours.slice(1);

    return (
        <Box
            sx={{
                padding: 2,
                maxWidth: 600,
                margin: "auto",
            }}
        >
            <Typography variant="h6" gutterBottom>
                Deporte
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Selecciona deporte</InputLabel>
                <Select value={deporte} onChange={(e) => { setDeporte(e.target.value); setEntrenadorId(null); }} label="Selecciona deporte">
                    <MenuItem value=""><em>Ninguno</em></MenuItem>
                    <MenuItem value="FUTBOL">Fútbol</MenuItem>
                    <MenuItem value="BASQUET">Básquet</MenuItem>
                    <MenuItem value="NATACION">Natación</MenuItem>
                    <MenuItem value="HANDBALL">Handball</MenuItem>
                </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>
                Entrenador (opcional)
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Entrenador</InputLabel>
                <Select value={entrenadorId ?? ""} onChange={(e) => setEntrenadorId(Number(e.target.value))} label="Entrenador">
                    <MenuItem value=""><em>Ninguno</em></MenuItem>
                    {entrenadoresFiltrados.map((e) => (
                        <MenuItem key={e.id} value={e.id}> DNI {e.usuarioDni} - {e.usuario.nombre} {e.usuario.apellido}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>
                Cancha
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Cancha</InputLabel>
                <Select value={canchaId ?? ""} onChange={(e) => setCanchaId(Number(e.target.value))} label="Cancha">
                    <MenuItem value=""><em>Ninguna</em></MenuItem>
                    {canchas.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                            ID {c.id} - {c.nombre}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>
                Días
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                {days.map((day) => (
                    <Button
                        key={day}
                        variant={diasSeleccionados.includes(day) ? "contained" : "outlined"}
                        onClick={() => {
                            if (diasSeleccionados.includes(day)) {
                                setDiasSeleccionados(diasSeleccionados.filter((d) => d !== day));
                            } else {
                                setDiasSeleccionados([...diasSeleccionados, day]);
                            }
                        }}
                        sx={{
                            flex: 1,
                            minWidth: "80px",
                            backgroundColor: diasSeleccionados.includes(day) ? "#1976d2" : "transparent",
                            color: diasSeleccionados.includes(day) ? "#fff" : "#1976d2",
                            borderColor: "#1976d2",
                            "&:hover": {
                                backgroundColor: diasSeleccionados.includes(day) ? "#115293" : "#e3f2fd",
                                borderColor: "#115293",
                            },
                            textTransform: "none",
                            fontWeight: "bold",
                            padding: "8px 16px",
                            borderRadius: "8px",
                        }}
                    >
                        {day}
                    </Button>
                ))}
            </Box>

            <Typography variant="h6" gutterBottom>
                Horarios
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Inicio</InputLabel>
                    <Select value={inicio} onChange={(e) => setInicio(e.target.value)} label="Inicio">
                        <MenuItem value=""><em>Horario</em></MenuItem>
                        {hours.slice(0, -1).map((h) => (
                            <MenuItem key={h} value={h}>{h}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>Fin</InputLabel>
                    <Select value={fin} onChange={(e) => setFin(e.target.value)} label="Fin">
                        <MenuItem value=""><em>Horario</em></MenuItem>
                        {horaFinOptions.map((h) => (
                            <MenuItem key={h} value={h}>{h}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Typography variant="h6" gutterBottom>
                Fecha
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Inicio"
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="Finalización"
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Box>

            <Typography variant="h6" gutterBottom>
                Precio
            </Typography>
            <TextField
                fullWidth
                label="Precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleGuardar}
            >
                Guardar
            </Button>
        </Box>
    );
}