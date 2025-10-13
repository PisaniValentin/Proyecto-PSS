"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Cancha = {
  id: number;
  nombre: string;
  tipoDeporte: string;
  interior: boolean;
  capacidadMax: number;
  precioHora: number;
  activa: boolean;
};

export default function AdminCanchasPage() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    tipoDeporte: "FUTBOL",
    interior: false,
    capacidadMax: 10,
    precioHora: 0,
  });

  const load = async () => {
    const r = await fetch("/api/cancha", { cache: "no-store" });
    const data = await r.json();
    setCanchas(Array.isArray(data) ? data : []);
  };

  useEffect(() => { load(); }, []);

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const r = await fetch("/api/cancha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await r.json();
    if (!r.ok) { setMsg(data?.error || "Error al crear"); return; }
    setMsg("✅ Cancha creada");
    setForm({ nombre: "", tipoDeporte: "FUTBOL", interior: false, capacidadMax: 10, precioHora: 0 });
    load();
  };

  const eliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar la cancha "${nombre}"?`)) return;
    try {
      const r = await fetch(`/api/cancha/${id}`, { method: "DELETE" });

      if (r.ok) {
        setMsg("🗑️ Cancha eliminada");
        await load();
        return;
      }
      let err: any = {};
      try { err = await r.json(); } catch {}
      setMsg(err?.error || "Error al eliminar");
    } catch {
      setMsg("⚠️ Error de conexión con el servidor");
    }
  };

  return (
    <main className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Gestión de Canchas</h1>

      {/* Alta */}
      <form onSubmit={crear} className="border p-6 rounded-lg bg-white space-y-4">
        <h2 className="text-xl font-semibold">Alta de cancha</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Nombre"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={form.tipoDeporte}
            onChange={(e) => setForm({ ...form, tipoDeporte: e.target.value })}
          >
            <option>FUTBOL</option><option>PADEL</option>
            <option>TENIS</option><option>BASQUET</option>
          </select>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.interior}
              onChange={(e) => setForm({ ...form, interior: e.target.checked })}
            />
            Interior
          </label>

          <input
            className="border p-2 rounded"
            type="number"
            min={1}
            placeholder="Capacidad máxima"
            value={form.capacidadMax}
            onChange={(e) => setForm({ ...form, capacidadMax: Number(e.target.value) })}
          />
          <input
            className="border p-2 rounded"
            type="number"
            step="0.01"
            min={0}
            placeholder="Precio por hora"
            value={form.precioHora}
            onChange={(e) => setForm({ ...form, precioHora: Number(e.target.value) })}
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Crear cancha
        </button>
        {msg && <p className="mt-2 text-sm">{msg}</p>}
      </form>

      {/* Listado */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Listado de canchas</h2>
        {canchas.length === 0 ? (
          <p className="text-gray-500">No hay canchas registradas.</p>
        ) : (
          <ul className="space-y-2">
            {canchas.map((c) => (
              <li key={c.id} className="border p-3 rounded bg-gray-50 flex justify-between items-center">
                <div>
                  <strong>{c.nombre}</strong> — {c.tipoDeporte} — {c.interior ? "Interior" : "Exterior"} —
                  Capacidad: {c.capacidadMax} — Precio: ${c.precioHora} — {c.activa ? "Activa" : "Inactiva"}
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/canchas/${c.id}`} className="px-3 py-1 rounded bg-yellow-500 text-white">
                    Editar
                  </Link>
                  <button
                    onClick={() => eliminar(c.id, c.nombre)}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
