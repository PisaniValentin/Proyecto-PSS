"use client";

import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const dni = formData.get("dni") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      dni,
      password,
      redirect: false,
    });

    setIsPending(false);

    const updatedSession = await getSession();

    if (res?.error) {
      setErrorMessage("Invalid credentials.");
    } else if (res?.ok) {
      router.refresh();
      if (updatedSession?.user?.rol === "ADMIN") {
        router.push("/admin");
      } else {
        if (updatedSession?.user?.rol === "ENTRENADOR") {
          router.push("/entrenador");
        } else {
          if (updatedSession?.user?.rol === "SOCIO") {
            router.push("/socio");
          }
        }
      }
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 flex items-center justify-center ">
        <div className="p-8 w-full max-w-sm">
          <Typography variant="h4" className="mb-4 text-center py-8">
            Bienvenido al Club Deportivo
          </Typography>
          <Typography variant="body1" className="mb-6 text-center py-4">
            Ingresa tu DNI y contraseña para acceder
          </Typography>

          <form onSubmit={handleSubmit}>
            <label className="text-md font-bold" htmlFor="dni">
              DNI:{" "}
            </label>
            <div className="border-1 rounded-[20px] input-border mb-4">
              <input
                className=" w-full p-1 pl-4"
                name="dni"
                type="text"
                id="dni"
                placeholder="DNI"
              />
            </div>
            <label className="text-md font-bold" htmlFor="password">
              Contraseña:{" "}
            </label>
            <div className="border-1 rounded-[20px] mb-4 border-gradient">
              <input
                className=" w-full p-1 pl-4"
                name="password"
                type="password"
                id="password"
                placeholder="Contraseña"
              />
            </div>
            <button
              className="border-1 rounded-[20px] bg-[#01161E] text-[#EFF6E0] w-1/2 text-center self-center mb-4"
              aria-disabled={isPending}
            >
              <div className="">Ingresar</div>
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
          </form>
        </div>
      </div>

      <div
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/wellcome.webp')",
        }}
      ></div>
    </div>
  );
}
