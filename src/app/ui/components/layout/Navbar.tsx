"use client";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";

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
          Club Deportivo - Panel Admin
        </Typography>
        <Button color="inherit" sx={{ fontWeight: 'bold' }}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}
