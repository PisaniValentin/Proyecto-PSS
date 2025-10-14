"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/componentes/Toast";

type TipoDeporte = "FÚTBOL" | "BÁSQUET" | "NATACIÓN" | "HANDBALL";
type Ubicacion = "INTERIOR" | "EXTERIOR";

type CanchaListado = {
  id: number | string;
  nombre: string;
  tipoDeporte: string; // FUTBOL / FÚTBOL
  interior?: boolean;
  ubicacion?: Ubicacion;
  capacidadMax?: number;
  capacidadMaxima?: number;
  precioHora?: number;
  precioPorHora?: number;
  dia: string; // LUNES / Lunes
  horaApertura: string;
  horaCierre: string;
};

type FormInput = {
  nombre: string;
  tipoDeporte: TipoDeporte;
  ubicacion: Ubicacion;
  capacidadMaxima: number;
  // string para permitir vacío visual (sin mostrar 0)
  precioPorHora: string;
  dia: string;
  horaApertura: string;
  horaCierre: string;
};

const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

const diaApiToUi: Record<string, string> = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
};

const deporteApiToUi: Record<string, string> = {
  FUTBOL: "FÚTBOL",
  BASQUET: "BÁSQUET",
  NATACION: "NATACIÓN",
  HANDBALL: "HANDBALL",
};

// ✅ Solo letras A–Z y espacios (sin tildes/ñ/símbolos) y al menos 1 carácter (se valida con trim)
const NOMBRE_REGEX = /^[A-Za-z ]+$/;

export default function AltaCanchaPage() {
  const [canchas, setCanchas] = useState<CanchaListado[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [generatedId, setGeneratedId] = useState<string>("");
  const { show, ToastPortal } = useToast();

  const [form, setForm] = useState<FormInput>({
    nombre: "",
    tipoDeporte: "FÚTBOL",
    ubicacion: "EXTERIOR",
    capacidadMaxima: 10,
    precioPorHora: "",
    dia: "Lunes",
    horaApertura: "08:00",
    horaCierre: "22:00",
  });

  async function loadCanchas() {
    const res = await fetch("/api/cancha", { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo cargar canchas");
    const data = (await res.json()) as CanchaListado[];
    const unique = Array.from(new Map(data.map((c) => [String(c.id), c])).values());
    setCanchas(unique);
  }

  useEffect(() => {
    loadCanchas().catch(console.error);
  }, []);

  function onChange<K extends keyof FormInput>(key: K, value: FormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm({
      nombre: "",
      tipoDeporte: "FÚTBOL",
      ubicacion: "EXTERIOR",
      capacidadMaxima: 10,
      precioPorHora: "",
      dia: "Lunes",
      horaApertura: "08:00",
      horaCierre: "22:00",
    });
    setGeneratedId("");
  }

  // Validaciones extra antes de enviar
  function validate(): string | null {
    const nombreTrim = form.nombre.trim();
    if (!nombreTrim || !NOMBRE_REGEX.test(nombreTrim)) {
      return "Ingresá un nombre válido: solo letras (A–Z) y espacios, sin tildes.";
    }
    if (!form.tipoDeporte) return "Seleccioná el tipo de deporte.";
    if (!form.ubicacion) return "Seleccioná la ubicación.";
    if (!form.capacidadMaxima || form.capacidadMaxima < 1) {
      return "La capacidad máxima debe ser un número mayor o igual a 1.";
    }
    if (form.precioPorHora === "") return "Ingresá el precio por hora.";
    if (Number.isNaN(Number(form.precioPorHora)) || Number(form.precioPorHora) < 0) {
      return "El precio por hora debe ser un número válido (0 o mayor).";
    }
    if (!form.dia) return "Seleccioná el día.";
    if (!form.horaApertura || !form.horaCierre) {
      return "Completá la hora de apertura y de cierre.";
    }
    const toMin = (s: string) => {
      const [h, m] = s.split(":").map(Number);
      return h * 60 + m;
    };
    if (toMin(form.horaApertura) >= toMin(form.horaCierre)) {
      return "La hora de apertura debe ser menor que la de cierre.";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const validationError = validate();
    if (validationError) {
      show(validationError, "error");
      return;
    }

    setSubmitting(true);
    try {
      const nombreTrim = form.nombre.trim();
      const precioNumber = Number(form.precioPorHora);
      const payload = {
        nombre: nombreTrim,
        tipoDeporte: form.tipoDeporte,
        interior: form.ubicacion === "INTERIOR",
        ubicacion: form.ubicacion,
        capacidadMax: form.capacidadMaxima,
        capacidadMaxima: form.capacidadMaxima,
        precioHora: precioNumber,
        precioPorHora: precioNumber,
        dia: form.dia,
        horaApertura: form.horaApertura,
        horaCierre: form.horaCierre,
      };

      const res = await fetch("/api/cancha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Error al crear la cancha");
      }

      const creada = await res.json();
      setGeneratedId(String(creada.id));
      await loadCanchas();
      show(`Cancha creada exitosamente (ID: ${creada.id})`, "success");
      // resetForm(); // si preferís limpiar el form
    } catch (error) {
      console.error(error);
      show((error as Error).message || "Error al crear la cancha", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const renderUbicacion = (c: CanchaListado) =>
    typeof c.interior === "boolean"
      ? c.interior
        ? "INTERIOR"
        : "EXTERIOR"
      : c.ubicacion ?? "EXTERIOR";
  const renderCapacidad = (c: CanchaListado) => (c.capacidadMax ?? c.capacidadMaxima) ?? "-";
  const renderPrecio = (c: CanchaListado) => {
    const p = c.precioHora ?? c.precioPorHora;
    return typeof p === "number" ? p : 0;
  };
  const renderDia = (c: CanchaListado) => diaApiToUi[c.dia] ?? c.dia;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Alta de cancha</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Id (autogenerado) */}
          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Id</span>
            <input
              readOnly
              value={generatedId}
              placeholder="<ID de la cancha>"
              className="border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700 italic"
            />
          </label>

          {/* Nombre */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              Nombre <span className="text-red-600">*</span>
            </span>
            <input
              required
              value={form.nombre}
              onChange={(e) => onChange("nombre", e.target.value)}
              placeholder="Ej: Cancha Norte"
              // HTML5 pattern para refuerzo nativo (sin acentos/ñ/símbolos)
              pattern="[A-Za-z ]+"
              title="Solo letras (A–Z) y espacios, sin tildes ni símbolos."
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            />
          </label>

          {/* Tipo de deporte */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              Tipo de deporte <span className="text-red-600">*</span>
            </span>
            <select
              required
              value={form.tipoDeporte}
              onChange={(e) => onChange("tipoDeporte", e.target.value as TipoDeporte)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            >
              <option>FÚTBOL</option>
              <option>BÁSQUET</option>
              <option>NATACIÓN</option>
              <option>HANDBALL</option>
            </select>
          </label>

          {/* Ubicación */}
          <div className="md:col-span-2">
            <span className="text-sm font-medium text-gray-700">
              Ubicación <span className="text-red-600">*</span>
            </span>
            <div className="mt-2 flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="ubicacion"
                  required
                  checked={form.ubicacion === "INTERIOR"}
                  onChange={() => onChange("ubicacion", "INTERIOR")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                Interior
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="ubicacion"
                  required
                  checked={form.ubicacion === "EXTERIOR"}
                  onChange={() => onChange("ubicacion", "EXTERIOR")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                Exterior
              </label>
            </div>
          </div>

          {/* Capacidad */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              Capacidad máxima <span className="text-red-600">*</span>
            </span>
            <input
              required
              type="number"
              min={1}
              value={form.capacidadMaxima}
              onChange={(e) => onChange("capacidadMaxima", Number(e.target.value))}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            />
          </label>

          {/* Precio */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              Precio por hora <span className="text-red-600">*</span>
            </span>
            <input
              required
              type="number"
              min={0}
              value={form.precioPorHora}
              onChange={(e) => onChange("precioPorHora", e.target.value)}
              placeholder="Ej: 50"
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            />
          </label>

          {/* Día */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              Día <span className="text-red-600">*</span>
            </span>
            <select
              required
              value={form.dia}
              onChange={(e) => onChange("dia", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            >
              {DIAS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>

          {/* Horas */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              Hora apertura <span className="text-red-600">*</span>
            </span>
            <input
              required
              type="time"
              value={form.horaApertura}
              onChange={(e) => onChange("horaApertura", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              Hora cierre <span className="text-red-600">*</span>
            </span>
            <input
              required
              type="time"
              value={form.horaCierre}
              onChange={(e) => onChange("horaCierre", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            />
          </label>

          <div className="md:col-span-2 flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {submitting ? "Creando..." : "Crear cancha"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border px-4 py-2 rounded-lg text-sm bg-gray-50 hover:bg-gray-100"
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-4xl mx-auto mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-3">Listado de canchas</h2>
        {canchas.length === 0 ? (
          <p className="text-sm text-gray-600">No hay canchas registradas.</p>
        ) : (
          <div className="space-y-3">
            {canchas.map((c) => (
              <div
                key={String(c.id)}
                className="border rounded-lg px-3 py-2 flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm text-gray-800">
                  <span className="font-semibold text-gray-900">ID: {String(c.id)}</span>{" "}
                  — <span className="font-semibold">{c.nombre}</span>{" "}
                  —{" "}
                  <span className="inline-block rounded-full px-2 py-0.5 text-xs bg-blue-50 text-blue-700 border border-blue-100">
                    {deporteApiToUi[c.tipoDeporte] ?? c.tipoDeporte}
                  </span>{" "}
                  —{" "}
                  <span className="inline-block rounded-full px-2 py-0.5 text-xs bg-slate-50 text-slate-700 border border-slate-100">
                    {renderUbicacion(c)}
                  </span>{" "}
                  — Capacidad: {renderCapacidad(c)} — Precio: ${renderPrecio(c)} — Día: {renderDia(c)} —{" "}
                  {c.horaApertura} a {c.horaCierre}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastPortal />
    </div>
  );
}
