"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditarCanchaPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    tipoDeporte: "FUTBOL",
    interior: false,
    capacidadMax: 10,
    precioHora: 0,
    activa: true,
  });
  const [msg, setMsg] = useState<string | null>(null);

  // 🔹 Cargar los datos actuales de la cancha
  useEffect(() => {
    if (!id) return;
    fetch(`/api/cancha/${id}`)
      .then((r) => r.json())
      .then((data) => setForm(data))
      .catch(() => setMsg("Error al cargar la cancha"));
  }, [id]);

  //  Guardar los cambios (PUT)
  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch(`/api/cancha/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (r.ok) {
      setMsg("✅ Cancha actualizada correctamente");
      setTimeout(() => router.push("/admin/canchas"), 1200);
    } else {
      const data = await r.json();
      setMsg(data.error || "Error al guardar los cambios");
    }
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Editar cancha #{id}</h1>
      <form onSubmit={guardar} className="border p-6 rounded space-y-4 bg-white">
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
          <option>PADEL</option>
          <option>TENIS</option>
          <option>BASQUET</option>
        </select>
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={form.interior}
            onChange={(e) => setForm({ ...form, interior: e.target.checked })}
          />
          Interior
        </label>
        <input
          className="border p-2 rounded w-full"
          type="number"
          placeholder="Capacidad máxima"
          value={form.capacidadMax}
          onChange={(e) =>
            setForm({ ...form, capacidadMax: Number(e.target.value) })
          }
        />
        <input
          className="border p-2 rounded w-full"
          type="number"
          placeholder="Precio por hora"
          value={form.precioHora}
          onChange={(e) =>
            setForm({ ...form, precioHora: Number(e.target.value) })
          }
        />
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={form.activa}
            onChange={(e) => setForm({ ...form, activa: e.target.checked })}
          />
          Activa
        </label>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Guardar cambios
        </button>
        {msg && <p>{msg}</p>}
      </form>
    </main>
  );
}
