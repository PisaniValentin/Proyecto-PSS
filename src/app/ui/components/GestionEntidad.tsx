"use client";

import React, { useState } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import ModalCrear from "./modal/ModalCrear";
import ModalBuscarDNI from "./modal/ModalBuscarDNI";
import ModalModificar from "./modal/ModalModificar";
import ModalEliminarConfirm from "./modal/ModalEliminarConfirm";
import ModalExito from "./modal/ModalExito";
import ModalError from "./modal/ModalError";

interface GestionEntidadProps {
  tipo: string;
}

export default function GestionEntidad({ tipo }: GestionEntidadProps) {
  const [modal, setModal] = useState<"crear" | "modificar" | "eliminar" | null>(
    null
  );
  const [dniInput, setDniInput] = useState("");
  const [usuarioEncontrado, setUsuarioEncontrado] = useState<any>(null);
  const [modalExito, setModalExito] = useState<null | string>(null);
  const [modalError, setModalError] = useState(false);

  const handleOpen = (accion: "crear" | "modificar" | "eliminar") => {
    setModal(accion);
    setDniInput("");
    setUsuarioEncontrado(null);
    setModalError(false);
  };

  const handleClose = () => setModal(null);

  const buscarUsuario = async () => {
    const res = await fetch(`/api/usuario/${dniInput}`);
    const data = await res.json();

    if (res.ok) {
      setUsuarioEncontrado(data);
    } else {
      setModalError(true);
    }
  };

  const guardarCambios = () => {
    setModal(null);
    setModalExito("modificado");
  };

  const confirmarEliminacion = () => {
    setModal(null);
    setModalExito("eliminado");
  };

  return (
    <Box className="p-8">
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: "bold", color: "#1F2937" }}
      >
        Operaciones sobre {tipo}s
      </Typography>

      <Grid container spacing={2}>
        <Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen("crear")}
          >
            Crear {tipo}
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleOpen("modificar")}
          >
            Modificar {tipo}
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleOpen("eliminar")}
          >
            Eliminar {tipo}
          </Button>
        </Grid>
      </Grid>

      {/* ------------------- MODALES ------------------- */}
      <ModalCrear
        open={modal === "crear"}
        onClose={handleClose}
        tipo={tipo}
        onCrear={(usuario) => {
          console.log("Usuario creado:", usuario);
          setModal(null);
          setModalExito("creado");
        }}
      />

      <ModalBuscarDNI
        open={modal === "modificar" && !usuarioEncontrado}
        onClose={handleClose}
        tipo={tipo}
        dniInput={dniInput}
        setDniInput={setDniInput}
        onBuscar={buscarUsuario}
      />

      <ModalModificar
        open={modal === "modificar" && usuarioEncontrado !== null}
        onClose={handleClose}
        usuario={usuarioEncontrado}
        setUsuario={setUsuarioEncontrado}
        onGuardar={guardarCambios}
        tipo={tipo}
      />

      <ModalBuscarDNI
        open={modal === "eliminar" && !usuarioEncontrado}
        onClose={handleClose}
        tipo={tipo}
        dniInput={dniInput}
        setDniInput={setDniInput}
        onBuscar={buscarUsuario}
        eliminar
      />

      <ModalEliminarConfirm
        open={modal === "eliminar" && usuarioEncontrado !== null}
        onClose={handleClose}
        usuario={usuarioEncontrado}
        onConfirm={confirmarEliminacion}
        tipo={tipo}
      />

      <ModalExito
        open={modalExito !== null}
        onClose={() => {
          setModalExito(null);
        }}
        exito={modalExito}
        tipo={tipo}
      />

      <ModalError
        open={modalError}
        onClose={() => setModalError(false)}
        tipo={tipo}
      />
    </Box>
  );
}
