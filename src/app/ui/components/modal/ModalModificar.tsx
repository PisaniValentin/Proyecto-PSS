"use client";
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";

interface ModalModificarProps {
    open: boolean;
    onClose: () => void;
    usuario: any;
    setUsuario: (usuario: any) => void;
    onGuardar: () => void;
    tipo: string;
    practicasDisponibles?: { id: number; deporte: string }[];
}

export default function ModalModificar({
    open,
    onClose,
    usuario,
    setUsuario,
    onGuardar,
    tipo,
    practicasDisponibles = [],
}: ModalModificarProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Modificar {tipo}</DialogTitle>
            <DialogContent dividers>
                <Grid container direction="column" spacing={2}>
                    {/* Campos comunes */}
                    <Grid>
                        <TextField
                            fullWidth
                            label="Nombre"
                            variant="outlined"
                            value={usuario?.nombre || ""}
                            onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            fullWidth
                            label="Apellido"
                            variant="outlined"
                            value={usuario?.apellido || ""}
                            onChange={(e) => setUsuario({ ...usuario, apellido: e.target.value })}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            value={usuario?.email || ""}
                            onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            fullWidth
                            label="Teléfono"
                            variant="outlined"
                            value={usuario?.telefono || ""}
                            onChange={(e) => setUsuario({ ...usuario, telefono: e.target.value })}
                        />
                    </Grid>

                    {/* Campos para Socio */}
                    {tipo === "Socio" && (
                        <>
                            <Grid>
                                <TextField
                                    select
                                    fullWidth
                                    label="Tipo de Plan"
                                    value={usuario?.tipoPlan || "INDIVIDUAL"}
                                    onChange={(e) => setUsuario({ ...usuario, tipoPlan: e.target.value })}
                                >
                                    <MenuItem value="INDIVIDUAL">Individual</MenuItem>
                                    <MenuItem value="FAMILIAR">Familiar</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid>
                                <TextField
                                    select
                                    fullWidth
                                    label="Estado"
                                    value={usuario?.estado || "ACTIVO"}
                                    onChange={(e) => setUsuario({ ...usuario, estado: e.target.value })}
                                >
                                    <MenuItem value="ACTIVO">Activo</MenuItem>
                                    <MenuItem value="INACTIVO">Inactivo</MenuItem>
                                    <MenuItem value="BLOQUEADO">Bloqueado</MenuItem>
                                </TextField>
                            </Grid>
                        </>
                    )}

                    {/* Campos para Entrenador */}
                    {tipo === "Entrenador" && (
                        <Grid>
                            <TextField
                                select
                                fullWidth
                                label="Práctica Deportiva"
                                value={usuario?.practicaId || ""}
                                onChange={(e) => setUsuario({ ...usuario, practicaId: Number(e.target.value) })}
                            >
                                {practicasDisponibles.map((p) => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.deporte}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" color="secondary" onClick={onGuardar}>
                    Guardar Cambios
                </Button>
            </DialogActions>
        </Dialog>
    );
}
