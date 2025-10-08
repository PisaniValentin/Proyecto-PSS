"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function crearEntrenador() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(null);
    const formData = new FormData(event.currentTarget);
    const nombre = formData.get("nombre") as string;
    const apellido = formData.get("apellido") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("contraseña") as string;
    const confirmPassword = formData.get("confirmar-contraseña") as string;
    const base_url = process.env.NEXT_PUBLIC_BASE_URL || "";

    const data = {
      nombre,
      apellido,
      username,
      email,
      password,
    };

    // if (password !== confirmPassword) {
    //   setErrorMessage("Contraseñas no coinciden.");
    // } else {
    //   const res = await fetch(`${base_url}/api/usuario`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   });
    //   if (!res.ok) {
    //     const result = await res.json();
    //     setErrorMessage(result.message || "Error al registrar usuario.");
    //     setIsPending(false);
    //     return;
    //   }
    router.push("/admin");
    // }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center h-max "
    >
      <div className="p-10 flex flex-col gap-1 md:w-1/3">
        <h1 className="font-bold bg-clip-text text-transparent text-4xl self-center">
          Registrate
        </h1>
        <h2 className="text-[#124559] font-bold text-3xl self-center mb-4">
          Hola! Bienvenido
        </h2>
        <label className="text-md font-bold" htmlFor="nombre">
          Nombre/s:{" "}
        </label>
        <div className="border-1 rounded-[20px] input-border mb-4">
          <input
            className=" rounded-[20px] w-full p-1 pl-4"
            name="nombre"
            type="text"
            id="nombre"
            placeholder=""
          />
        </div>
        <label className="text-md font-bold" htmlFor="apellido">
          Apellido:{" "}
        </label>
        <div className="border-1 rounded-[20px] input-border mb-4">
          <input
            className="rounded-[20px] w-full p-1 pl-4"
            name="apellido"
            type="text"
            id="apellido"
            placeholder=""
          />
        </div>
        <label className="text-md font-bold" htmlFor="dni">
          DNI:{" "}
        </label>
        <div className="border-1 rounded-[20px] input-border mb-4">
          <input
            className=" rounded-[20px] w-full p-1 pl-4"
            name="dni"
            type="text"
            id="dni"
            placeholder=""
          />
        </div>
        <label className="text-md font-bold" htmlFor="email">
          Email:{" "}
        </label>
        <div className="border-1 rounded-[20px] input-border mb-4">
          <input
            className=" rounded-[20px] w-full p-1 pl-4"
            name="email"
            type="email"
            id="email"
            placeholder="something@gmail.com"
          />
        </div>
        <label className="text-md font-bold" htmlFor="telefono">
          Telefono:{" "}
        </label>
        <div className="border-1 input-border mb-4  rounded-[20px]">
          <input
            className=" rounded-[20px] w-full p-1 pl-4"
            name="telefono"
            id="telefono"
          />
        </div>
        <button
          type="submit"
          className="transition duration-200 hover:scale-110 border-1 bg-[#01161E] text-[#EFF6E0] rounded-[20px] w-1/2 text-center self-center mb-4"
          aria-disabled={isPending}
        >
          <div className="">Guardar</div>
        </button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <div className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
