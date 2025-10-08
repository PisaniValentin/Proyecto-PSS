"use client";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import PoolIcon from '@mui/icons-material/Pool';


export default function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        background: '#124559',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
          <PoolIcon />  Bahía Blanca Club
        </Typography>
        <Button color="inherit" sx={{ fontWeight: 'bold' }}><LogoutIcon /></Button>
      </Toolbar>
    </AppBar >
  );
}
