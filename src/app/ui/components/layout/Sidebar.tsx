"use client";

import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HomeIcon from '@mui/icons-material/Home';
import Link from "next/link";

const secciones = [
  { nombre: "Home", path: "", icon: <HomeIcon /> },
  { nombre: "Prácticas Deportivas", path: "practicas", icon: <SportsSoccerIcon /> },
  { nombre: "Alquileres", path: "alquileres", icon: <SportsBasketballIcon /> },
  { nombre: "Gestión de Cuentas", path: "cuentas", icon: <AccountCircleIcon /> },
  { nombre: "Reportes", path: "reportes", icon: <ReceiptIcon /> },
  { nombre: "Pagos", path: "pagos", icon: <PaymentIcon /> },
  { nombre: "Otro", path: "otros", icon: <MoreHorizIcon /> },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 250,
        height: '100vh',
        p: 2,
        color: 'white',
        background: '#111111',
      }}
    >
      <Typography variant="h6" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        Panel
      </Typography>
      <List>
        {secciones.map((sec) => (
          <ListItemButton
            key={sec.nombre}
            component={Link}
            href={`/admin/${sec.path}`}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&:hover': { bgcolor: '#598392' }
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>{sec.icon}</ListItemIcon>
            <ListItemText primary={sec.nombre} />
          </ListItemButton>
        ))}
      </List>
    </Box >
  );
}
