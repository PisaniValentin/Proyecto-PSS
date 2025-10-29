"use client";
import { useEffect, useState } from "react";
import { PracticaDeportiva, InscripcionDeportiva } from "@/app/lib/types";
import { signOut } from "next-auth/react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSession } from "next-auth/react";
import { set } from "zod/v4";

export default function Page() {
  const [modo, setModo] = useState<"MIS_PRACTICAS" | "INSCRIBIRME" | "">("");
  const { data: session } = useSession();
  const [practicasDeportivas, setPracticasDeportivas] = useState<
    PracticaDeportiva[]
  >([]);
  const [misPracticas, setmisPracticas] = useState<InscripcionDeportiva[]>([]);
  const [socioId, setSocioId] = useState<number | null>(null);

  const inscribirse = async (practicaId: number) => {
    const res = await fetch("/api/inscripcionDeportiva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        socioId: socioId,
        practicaId: practicaId,
        precioPagado: 100, //Por defecto
      }),
    });
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status}`);
    }
    const data = await res.json();
    setPracticasDeportivas((prevPracticas) =>
      prevPracticas.filter((practica) => practica.id !== data.practica.id)
    );
  };

  const desincribirse = async (inscripcionId: number) => {
    const res = await fetch(`/api/inscripcionDeportiva/${inscripcionId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status}`);
    }
    const data = await res.json();
    setmisPracticas((prevPracticas) =>
      prevPracticas.filter((inscripcion) => inscripcion.id !== inscripcionId)
    );
  };

  useEffect(() => {
    // Definimos una función asíncrona principal
    const inicializarDatos = async () => {
      if (!session?.user?.dni) return; // Salir si no hay DNI

      // 1. OBTENER AMBOS DATOS CONCURRENTEMENTE
      try {
        // Obtener inscripciones del usuario
        const [resMisPracticas, resTodasPracticas] = await Promise.all([
          fetch(`/api/socio/${session.user.dni}`),
          fetch("/api/practicaDeportiva"),
        ]);

        // Manejo de errores
        if (!resMisPracticas.ok)
          throw new Error(
            `Error al obtener inscripciones: ${resMisPracticas.status}`
          );
        if (!resTodasPracticas.ok)
          throw new Error(
            `Error al obtener todas las prácticas: ${resTodasPracticas.status}`
          );

        const dataMisPracticas = await resMisPracticas.json();
        setSocioId(dataMisPracticas.id);
        const dataTodasPracticas = await resTodasPracticas.json();
        const inscripciones: InscripcionDeportiva[] =
          dataMisPracticas.inscripciones || [];
        const todasLasPracticas: PracticaDeportiva[] = dataTodasPracticas || [];

        // 2. EXTRAER IDs de las prácticas ya inscritas
        // Usamos un Set para una búsqueda O(1) mucho más rápida.
        const idsInscritos = new Set(
          inscripciones.map((inscripcion) => inscripcion.practicaId)
        );

        // 3. FILTRAR las prácticas disponibles
        const practicasDisponibles = todasLasPracticas.filter(
          (practica) =>
            // Excluir la práctica si su ID se encuentra en el Set de inscritos
            !idsInscritos.has(practica.id)
        );

        // 4. ESTABLECER LOS ESTADOS
        setmisPracticas(inscripciones);
        setPracticasDeportivas(practicasDisponibles);
        // También puedes establecer el modo si es necesario:
        // setModo("INSCRIBIRME");
      } catch (error) {
        console.error("Error al inicializar datos:", error);
        // Manejar error (ej: setear estado de error, mostrar notificación)
      }
    };
    if (session?.user) {
      inicializarDatos();
    }
    // Dependencias: Ejecutar cuando cambie la sesión (al iniciar)
  }, [modo, session?.user]);

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
      <div className="flex gap-4 p-2">
        <button
          className={`border p-2 rounded-2xl hover:scale-105 transition duration-300 ${
            modo === "MIS_PRACTICAS" ? "bg-gray-700 text-white" : ""
          }`}
          onClick={() => setModo("MIS_PRACTICAS")}
        >
          Mis practicas
        </button>
        <button
          className={`border p-2 rounded-2xl hover:scale-105 transition duration-300 ${
            modo === "INSCRIBIRME" ? "bg-gray-700 text-white" : ""
          }`}
          onClick={() => setModo("INSCRIBIRME")}
        >
          Inscribirme a practicas deportivas
        </button>
        <button
          className={`border p-2 rounded-2xl hover:scale-105 transition duration-300 ${
            modo === "" ? "bg-gray-700 text-white" : ""
          }`}
          onClick={() => {
            setModo("");
          }}
        >
          Inicio
        </button>
      </div>

      {modo === "MIS_PRACTICAS" && (
        <div className="">
          {misPracticas.map((practica) => (
            <div key={practica.id} className="border p-2 m-2 bg-white">
              <div>Deporte: {practica.practica?.deporte}</div>
              <div>Cancha: {practica.practica?.canchaId}</div>
              <div>Fecha Inicio: {practica.practica?.fechaInicio}</div>
              <div>Fecha Fin: {practica.practica?.fechaFin}</div>
              {/* <div>{practica.practica?.}</div> */}
              <div>
                Profesores:
                {practica.practica?.entrenadores.map((entrenador) => (
                  <div key={entrenador.id} className="flex gap-2">
                    -<p>{entrenador.usuario.nombre}</p>
                    <p>{entrenador.usuario.apellido}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  desincribirse(practica.id);
                }}
                className="border p-1 rounded-2xl hover:scale-105 transition duration-300"
              >
                Darme de baja
              </button>
            </div>
          ))}
        </div>
      )}
      {modo === "INSCRIBIRME" && (
        <div className="">
          {practicasDeportivas.map((practica) => (
            <div key={practica.id} className="border p-2 m-2 bg-white">
              <div>Deporte: {practica.deporte}</div>
              <div>Cancha: {practica.canchaId}</div>
              <div>Fecha Inicio: {practica.fechaInicio}</div>
              <div>Fecha Fin: {practica.fechaFin}</div>
              <div>
                Profesores:
                {practica.entrenadores.map((entrenador) => (
                  <div key={entrenador.id} className="flex gap-2">
                    -<p>{entrenador.usuario.nombre}</p>
                    <p>{entrenador.usuario.apellido}</p>
                  </div>
                ))}
              </div>
              <div>
                Capacidad: {practica.inscripciones.length} /{" "}
                {practica.cancha.capacidadMax}
              </div>
              {practica.cancha.capacidadMax > practica.inscripciones.length && (
                <button
                  onClick={() => inscribirse(practica.id)}
                  className="border p-1 rounded-2xl hover:scale-105 transition duration-300"
                >
                  Inscribirme
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
