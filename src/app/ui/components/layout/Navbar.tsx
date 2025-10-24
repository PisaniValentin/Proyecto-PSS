"use client";

import { AppBar, Toolbar } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        background: 'Beige',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Image
          src="/LogoBahia.png"
          alt="Bahía Blanca Club"
          width={200}
          height={100}
          style={{ objectFit: "contain" }}
        />
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-black hover:text-rose-600"
        >
          <LogoutIcon sx={{ fontSize: "1.85rem" }} />
        </button>
      </Toolbar>
    </AppBar >
  );
}
