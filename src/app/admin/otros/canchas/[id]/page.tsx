"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const DIAS = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

export default function EditarCanchaPage() {
  const p = useParams();
  const id = String(Array.isArray(p.id) ? p.id[0] : p.id);
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    tipoDeporte: "FUTBOL",
    interior: false,
    capacidadMax: 10,
    precioHora: 0,
    activa: true,
    dia: "LUNES",
    horaApertura: "08:00",
    horaCierre: "22:00",
  });
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/cancha/${id}`)
      .then((r) => r.json())
      .then((d) => setForm(d))
      .catch(() => setMsg("⚠️ Error al cargar cancha"));
  }, [id]);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch(`/api/cancha/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (r.ok) {
      setMsg("✅ Cancha actualizada");
      setTimeout(() => router.push("/admin/canchas"), 1000);
    } else {
      const data = await r.json().catch(() => ({}));
      setMsg(data.error || "Error al guardar");
    }
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Editar cancha #{id}</h1>

      <form
        onSubmit={guardar}
        className="border p-6 rounded bg-white shadow space-y-4 max-w-xl"
      >
        <input
          className="border p-2 rounded w-full"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />

        <select
          className="border p-2 rounded w-full"
          value={form.tipoDeporte}
          onChange={(e) => setForm({ ...form, tipoDeporte: e.target.value })}
        >
          <option>FUTBOL</option>
          <option>BASQUET</option>
          <option>NATACION</option>
          <option>HANDBALL</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.interior}
            onChange={(e) => setForm({ ...form, interior: e.target.checked })}
          />
          Interior
        </label>

        <input
          type="number"
          className="border p-2 rounded w-full"
          placeholder="Capacidad máxima"
          value={form.capacidadMax}
          onChange={(e) => setForm({ ...form, capacidadMax: Number(e.target.value) })}
        />

        <input
          type="number"
          step="0.01"
          className="border p-2 rounded w-full"
          placeholder="Precio por hora"
          value={form.precioHora}
          onChange={(e) => setForm({ ...form, precioHora: Number(e.target.value) })}
        />

        <select
          className="border p-2 rounded w-full"
          value={form.dia}
          onChange={(e) => setForm({ ...form, dia: e.target.value })}
        >
          {DIAS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <input
          type="time"
          className="border p-2 rounded w-full"
          value={form.horaApertura}
          onChange={(e) => setForm({ ...form, horaApertura: e.target.value })}
        />

        <input
          type="time"
          className="border p-2 rounded w-full"
          value={form.horaCierre}
          onChange={(e) => setForm({ ...form, horaCierre: e.target.value })}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.activa}
            onChange={(e) => setForm({ ...form, activa: e.target.checked })}
          />
          Activa
        </label>

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Guardar cambios
        </button>

        {msg && <p>{msg}</p>}
      </form>
    </main>
  );
}
