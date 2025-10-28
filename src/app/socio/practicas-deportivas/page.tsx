"use client";
import { useState } from "react";
import { PracticaDeportiva, InscripcionDeportiva } from "@/app/lib/types";
import { signOut } from "next-auth/react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSession } from "next-auth/react";

export default function Page() {
  const [modo, setModo] = useState<"MIS_PRACTICAS" | "INSCRIBIRME" | "">("");
  const { data: session } = useSession();
  const [practicasDeportivas, setPracticasDeportivas] = useState<
    PracticaDeportiva[]
  >([]);
  const [misPracticas, setmisPracticas] = useState<InscripcionDeportiva[]>([]);

  const getMisPracticas = async () => {
    setModo("MIS_PRACTICAS");
    console.log("DNI del socio:", session?.user.dni);
    const res = await fetch(`/api/socio/${session?.user.dni}`);
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status}`);
    }
    const data = await res.json();
    console.log("Inscripciones deportivas del socio:", data.inscripciones);
    setmisPracticas(data.inscripciones);
  };

  const getInscribirme = async () => {
    setModo("INSCRIBIRME");
    const res = await fetch("/api/practicaDeportiva");
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status}`);
    }
    const data = await res.json();
    setPracticasDeportivas(data);
  };
  return (
    <div className="h-screen">
      <header className="h-1/8 flex items-center justify-between px-14 bg-[#124559] w-full">
        <h1 className="text-2xl font-bold text-white">BahiaBlanca Club</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-white hover:text-rose-600"
        >
          <LogoutIcon />
        </button>
      </header>
      <button onClick={getMisPracticas}>Mis practicas</button>
      <button onClick={getInscribirme}>
        Inscribirme a practicas deportivas
      </button>
      <button
        onClick={() => {
          setModo("");
        }}
      >
        Atras
      </button>

      {modo === "MIS_PRACTICAS" && (
        <div className="bg-blue-500">
          {misPracticas.map((practica) => (
            <div key={practica.id} className="border p-2 m-2 bg-white">
              <div>Deporte: {practica.practica?.deporte}</div>
              <div>Cancha: {practica.practica?.canchaId}</div>
              <div>Fecha Inicio: {practica.practica?.fechaInicio}</div>
              <div>Fecha Fin: {practica.practica?.fechaFin}</div>
              <button>Inscribirme</button>
            </div>
          ))}
        </div>
      )}
      {modo === "INSCRIBIRME" && (
        <div className="bg-blue-500">
          {practicasDeportivas.map((practica) => (
            <div key={practica.id} className="border p-2 m-2 bg-white">
              <div>Deporte: {practica.deporte}</div>
              <div>Cancha: {practica.canchaId}</div>
              <div>Fecha Inicio: {practica.fechaInicio}</div>
              <div>Fecha Fin: {practica.fechaFin}</div>
              <div>Capacidad: {practica.cancha.capacidadMax}</div>
              <button>Inscribirme</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
