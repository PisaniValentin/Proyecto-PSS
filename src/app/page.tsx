"use client";

import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useState } from "react";

export default function HomePage() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert(`DNI: ${dni}\nContraseña: ${password}`);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 flex items-center justify-center ">
        <div className="p-8 w-full max-w-sm">
          <Typography variant="h4" className="mb-4 text-center py-8">
            Bienvenido al Club Deportivo
          </Typography>
          <Typography variant="body1" className="mb-6 text-center py-4">
            Ingresa tu DNI y contraseña para acceder
          </Typography>

          <Box className="flex flex-col gap-4">
            <TextField
              label="DNI"
              variant="outlined"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              fullWidth
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              color="error"
              onClick={handleLogin}
              fullWidth
            >
              Ingresar
            </Button>
          </Box>
        </div>
      </div>

      <div
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/wellcome.webp')",
        }}
      ></div>
    </div>
  );
}
