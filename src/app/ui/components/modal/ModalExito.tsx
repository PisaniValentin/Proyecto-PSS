"use client";

import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/navigation";

interface ModalExitoProps {
  open: boolean;
  onClose: () => void;
  exito: string | null;
  tipo: string;
}

export default function ModalExito({
  open,
  onClose,
  exito,
  tipo,
}: ModalExitoProps) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push(`/admin`);
  };

  const accionTexto =
    exito === "modificado"
      ? "modificada"
      : exito === "creado"
        ? "creada"
        : "eliminada";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
        },
      }}
    >
      {/* Ícono */}
      <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
        <CheckCircleOutlineIcon
          sx={{ fontSize: 60, color: "success.main", mb: 1 }}
        />
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          ¡{tipo} {accionTexto} con éxito!
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          El/la {tipo.toLowerCase()}/a fue {accionTexto} correctamente del sistema.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          color="success"
          sx={{ px: 4, borderRadius: 2 }}
        >
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
