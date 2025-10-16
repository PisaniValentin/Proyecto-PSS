// app/admin/otros/canchas/editar/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "@/app/ui/components/Toast";

/** Etiquetas UI (con acentos para mostrar) */
type TipoDeporteUI = "FUTBOL" | "BASQUET" | "NATACION" | "HANDBALL";
type Ubicacion = "INTERIOR" | "EXTERIOR";

/** Lo que devuelve la API */
type CanchaAPI = {
    id: number;
    nombre: string;
    tipoDeporte: string;   // FUTBOL | BASQUET | NATACION | HANDBALL
    interior: boolean;
    capacidadMax: number;
    precioHora: number;
    activa: boolean;
    dia: string;           // LUNES | MARTES | ...
    horaApertura: string;
    horaCierre: string;
};

type FormUI = {
    nombre: string;
    tipoDeporte: TipoDeporteUI;
    ubicacion: Ubicacion;
    capacidadMaxima: number;
    precioPorHora: number | "";
    dia: string; // "Lunes", "Miércoles", ...
    horaApertura: string;
    horaCierre: string;
};

const DIAS_UI = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;

const deporteApiToUi: Record<string, TipoDeporteUI> = {
    FUTBOL: "FUTBOL",
    BASQUET: "BASQUET",
    NATACION: "NATACION",
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
function apiToUi(c: CanchaAPI): FormUI {
    return {
        nombre: c.nombre ?? "",
        tipoDeporte: (deporteApiToUi[c.tipoDeporte] ?? "FUTBOL") as TipoDeporteUI,
        ubicacion: c.interior ? "INTERIOR" : "EXTERIOR",
        capacidadMaxima: typeof c.capacidadMax === "number" ? c.capacidadMax : 10,
        precioPorHora: typeof c.precioHora === "number" ? c.precioHora : "",
        dia: diaApiToUi[c.dia] ?? "Lunes",
        horaApertura: c.horaApertura ?? "08:00",
        horaCierre: c.horaCierre ?? "22:00",
    };
}

/** ✅ Solo letras A–Z y espacios (sin tildes/símbolos) */
const NOMBRE_REGEX = /^[A-Za-z ]+$/;

export default function EditarCanchaPage() {
    const [canchas, setCanchas] = useState<CanchaAPI[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { show, ToastPortal } = useToast();

    const [form, setForm] = useState<FormUI>({
        nombre: "",
        tipoDeporte: "FUTBOL",
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
        const data = (await res.json()) as CanchaAPI[];
        const unique = Array.from(new Map(data.map(c => [c.id, c])).values());
        setCanchas(unique);
    }
    useEffect(() => { loadCanchas().catch(console.error); }, []);

    const canchaSel = useMemo(
        () => canchas.find(c => c.id === selectedId) ?? null,
        [canchas, selectedId]
    );
    useEffect(() => { if (canchaSel) setForm(apiToUi(canchaSel)); }, [canchaSel]);

    function onChange<K extends keyof FormUI>(k: K, v: FormUI[K]) {
        setForm(prev => ({ ...prev, [k]: v }));
    }
    function reset() {
        setSelectedId(null);
        setForm({
            nombre: "",
            tipoDeporte: "FUTBOL",
            ubicacion: "EXTERIOR",
            capacidadMaxima: 10,
            precioPorHora: "",
            dia: "Lunes",
            horaApertura: "08:00",
            horaCierre: "22:00",
        });
    }

    // ✅ Validaciones (igual que Alta)
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
        if (selectedId == null || submitting) return;

        const err = validate();
        if (err) { show(err, "error"); return; }

        setSubmitting(true);
        try {
            const payload = {
                nombre: form.nombre.trim(),
                tipoDeporte: form.tipoDeporte,
                interior: form.ubicacion === "INTERIOR",
                ubicacion: form.ubicacion,
                capacidadMax: form.capacidadMaxima,
                capacidadMaxima: form.capacidadMaxima,
                precioHora: Number(form.precioPorHora),
                precioPorHora: Number(form.precioPorHora),
                dia: form.dia,
                horaApertura: form.horaApertura,
                horaCierre: form.horaCierre,
            };
            const res = await fetch(`/api/cancha/${selectedId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                cache: "no-store",
            });
            if (!res.ok) {
                const er = await res.json().catch(() => ({}));
                throw new Error(er?.error || "No se pudo actualizar la cancha");
            }
            await loadCanchas();
            show("Cambios guardados exitosamente", "success");
        } catch (err) {
            console.error(err);
            show((err as Error).message || "Error al actualizar la cancha", "error");
        } finally {
            setSubmitting(false);
        }
    }

    // helpers de visualización (para listado)
    const renderUbicacion = (c: CanchaAPI) => (c.interior ? "INTERIOR" : "EXTERIOR");
    const renderDia = (c: CanchaAPI) => diaApiToUi[c.dia] ?? c.dia;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-10">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl border border-gray-200 p-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Editar cancha</h1>

                {/* Selector + Id */}
                <div className="mb-5">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-700">
                            Seleccioná una cancha <span className="text-red-600">*</span>
                        </span>
                        <select
                            required
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
                    {/*
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
                    */}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                            pattern="[A-Za-z ]+"
                            title="Solo letras (A–Z) y espacios, sin tildes ni símbolos."
                            className="border rounded-lg px-3 py-2 text-sm"
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
                            onChange={(e) => onChange("tipoDeporte", e.target.value as TipoDeporteUI)}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option>FÚTBOL</option><option>BÁSQUET</option><option>NATACIÓN</option><option>HANDBALL</option>
                        </select>
                    </label>

                    {/* Ubicación */}
                    <div className="md:col-span-2">
                        <span className="text-sm font-medium text-gray-700">
                            Ubicación <span className="text-red-600">*</span>
                        </span>
                        <div className="mt-2 flex items-center gap-6">
                            <label className="inline-flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="ubicacion"
                                    required
                                    checked={form.ubicacion === "INTERIOR"}
                                    onChange={() => onChange("ubicacion", "INTERIOR")}
                                />
                                Interior
                            </label>
                            <label className="inline-flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="ubicacion"
                                    required
                                    checked={form.ubicacion === "EXTERIOR"}
                                    onChange={() => onChange("ubicacion", "EXTERIOR")}
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
                            className="border rounded-lg px-3 py-2 text-sm"
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
                            onChange={(e) => onChange("precioPorHora", e.target.value === "" ? "" : Number(e.target.value))}
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                    </label>

                    {/* Día 
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-700">
                            Día <span className="text-red-600">*</span>
                        </span>
                        <select
                            required
                            value={form.dia}
                            onChange={(e) => onChange("dia", e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            {DIAS_UI.map(d => <option key={d}>{d}</option>)}
                        </select>
                    </label>
*/}
                    {/* Horas 
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-700">
                            Hora apertura <span className="text-red-600">*</span>
                        </span>
                        <input
                            required
                            type="time"
                            value={form.horaApertura}
                            onChange={(e) => onChange("horaApertura", e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm"
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
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                    </label>
*/}
                    <div className="md:col-span-2 flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={submitting || selectedId == null}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                            {submitting ? "Guardando..." : "Guardar cambios"}
                        </button>
                        <button
                            type="button"
                            onClick={reset}
                            className="border px-4 py-2 rounded-lg text-sm bg-gray-50 hover:bg-gray-100"
                        >
                            Limpiar
                        </button>
                    </div>
                </form>
            </div>

            {/* === Canchas registradas (idéntico a ALTA) === */}
            <div className="max-w-4xl mx-auto mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-3">Listado de canchas</h2>
                {canchas.length === 0 ? (
                    <p className="text-sm text-gray-600">No hay canchas registradas.</p>
                ) : (
                    <div className="space-y-3">
                        {canchas.map((c) => (
                            <div
                                key={c.id}
                                role="button"
                                onClick={() => setSelectedId(c.id)}
                                className={`border rounded-lg px-3 py-2 flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors cursor-pointer ${selectedId === c.id ? "border-blue-300 bg-blue-50" : "border-gray-200"
                                    }`}
                            >
                                <div className="text-sm text-gray-800">
                                    <span className="font-semibold text-gray-900">ID: {c.id}</span>{" "}
                                    — <span className="font-semibold">{c.nombre}</span>{" "}
                                    —{" "}
                                    <span className="inline-block rounded-full px-2 py-0.5 text-xs bg-blue-50 text-blue-700 border border-blue-100">
                                        {deporteApiToUi[c.tipoDeporte] ?? c.tipoDeporte}
                                    </span>{" "}
                                    —{" "}
                                    <span className="inline-block rounded-full px-2 py-0.5 text-xs bg-slate-50 text-slate-700 border border-slate-100">
                                        {renderUbicacion(c)}
                                    </span>{" "}
                                    — Capacidad: {c.capacidadMax} — Precio: ${c.precioHora} {/*— Día: {renderDia(c)} — {c.horaApertura} a {c.horaCierre}*/}
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