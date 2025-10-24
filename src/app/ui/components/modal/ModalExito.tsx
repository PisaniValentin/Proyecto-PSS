"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import Check from '@mui/icons-material/CheckCircleOutline';

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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        transition: { timeout: 0 },
      }}
    >
      <DialogTitle><Check sx={{ color: 'green', fontWeight: 'bold' }} /> Éxito</DialogTitle>
      <DialogContent dividers>
        <Typography>
          {exito !== null && exito === "modificado"
            ? `${tipo} modificado con éxito`
            : exito === "creado"
              ? `${tipo} creado con éxito`
              : `${tipo} eliminado con éxito`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
