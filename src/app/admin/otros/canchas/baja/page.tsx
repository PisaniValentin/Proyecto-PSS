"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "@/componentes/Toast";

type CanchaAPI = {
  id: number;
  nombre: string;
  tipoDeporte: string;
  interior: boolean;
  capacidadMax: number;
  precioHora: number;
  activa: boolean;
  dia: string;
  horaApertura: string;
  horaCierre: string;
};

const deporteApiToUi: Record<string, string> = {
  FUTBOL: "FÚTBOL",
  BASQUET: "BÁSQUET",
  NATACION: "NATACIÓN",
  HANDBALL: "HANDBALL",
};
const diaApiToUi: Record<string, string> = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
};

export default function BajaCanchaPage() {
  const [canchas, setCanchas] = useState<CanchaAPI[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { show, ToastPortal } = useToast();

  async function loadCanchas() {
    const res = await fetch("/api/cancha", { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo cargar canchas");
    const data = (await res.json()) as CanchaAPI[];
    const unique = Array.from(new Map(data.map(c => [c.id, c])).values()).filter(c => c.activa !== false);
    setCanchas(unique);
  }
  useEffect(() => { loadCanchas().catch(console.error); }, []);

  const canchaSel = useMemo(
    () => canchas.find(c => c.id === selectedId) ?? null,
    [canchas, selectedId]
  );

  async function handleDelete() {
    if (selectedId == null) return show("Seleccioná una cancha para eliminar", "info");
    const nombre = canchaSel?.nombre ?? "la cancha";
    if (!confirm(`¿Eliminar ${nombre}?`)) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/cancha/${selectedId}`, { method: "DELETE", cache: "no-store" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "No se pudo eliminar la cancha");
      }
      await loadCanchas();
      setSelectedId(null);
      show("Cancha eliminada exitosamente", "success");
    } catch (e) {
      console.error(e);
      show((e as Error).message || "Error al eliminar la cancha", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Baja de cancha</h1>

        <div className="mb-5">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              Seleccioná una cancha activa <span className="text-red-600">*</span>
            </span>
            <select
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            >
              <option value="">— Elegir —</option>
              {canchas.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} · {c.nombre} · {deporteApiToUi[c.tipoDeporte] ?? c.tipoDeporte} · {c.interior ? "INTERIOR" : "EXTERIOR"}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-3">
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Id</span>
              <input
                readOnly
                value={selectedId ?? ""}
                placeholder="<ID de la cancha>"
                className="border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700 italic"
              />
            </label>
          </div>

          {canchaSel && (
            <div className="mt-3 text-sm text-gray-700 border rounded-lg p-3 bg-gray-50">
              <div><span className="font-semibold">ID:</span> {canchaSel.id}</div>
              <div><span className="font-semibold">Nombre:</span> {canchaSel.nombre}</div>
              <div><span className="font-semibold">Deporte:</span> {deporteApiToUi[canchaSel.tipoDeporte] ?? canchaSel.tipoDeporte}</div>
              <div><span className="font-semibold">Ubicación:</span> {canchaSel.interior ? "INTERIOR" : "EXTERIOR"}</div>
              <div><span className="font-semibold">Capacidad:</span> {canchaSel.capacidadMax}</div>
              <div><span className="font-semibold">Precio:</span> ${canchaSel.precioHora}</div>
              <div><span className="font-semibold">Horario:</span> {diaApiToUi[canchaSel.dia] ?? canchaSel.dia} · {canchaSel.horaApertura} a {canchaSel.horaCierre}</div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={selectedId == null || deleting}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="border px-4 py-2 rounded-lg text-sm bg-gray-50 hover:bg-gray-100"
          >
            Cancelar
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-3">Canchas activas</h2>
        {canchas.length === 0 ? (
          <p className="text-sm text-gray-600">No hay canchas activas.</p>
        ) : (
          <div className="space-y-2">
            {canchas.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 ${
                  selectedId === c.id ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              >
                <span className="font-semibold">#{c.id}</span> — <span className="font-semibold">{c.nombre}</span>{" "}
                — {deporteApiToUi[c.tipoDeporte] ?? c.tipoDeporte} — {c.interior ? "INTERIOR" : "EXTERIOR"} —{" "}
                {diaApiToUi[c.dia] ?? c.dia} {c.horaApertura}-{c.horaCierre}
              </button>
            ))}
          </div>
        )}
      </div>

      <ToastPortal />
    </div>
  );
}
