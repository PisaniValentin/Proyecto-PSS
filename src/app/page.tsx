"use client";

import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

export default function HomePage() {
  // const [dni, setDni] = useState("");
  // const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // const handleLogin = () => {
  //   alert(`DNI: ${dni}\nContraseña: ${password}`);
  // };

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
      callbackUrl,
    });

    setIsPending(false);

    if (res?.error) {
      setErrorMessage("Invalid credentials.");
    } else if (res?.ok) {
      router.refresh();
      router.push(res.url || "/");
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
                type="dni"
                id="dni"
                placeholder="DNI"
              />
            </div>
            <label className="text-md font-bold" htmlFor="contraseña">
              Contraseña:{" "}
            </label>
            <div className="border-1 rounded-[20px] mb-4 border-gradient">
              <input
                className=" w-full p-1 pl-4"
                name="contraseña"
                type="password"
                id="contraseña"
                placeholder="Contraseña"
              />
            </div>
            <button
              className="border-1 rounded-[20px] bg-[#01161E] text-[#EFF6E0] w-1/2 text-center self-center mb-4"
              aria-disabled={isPending}
            >
              <div className="">Ingresar</div>
            </button>
          </form>

          {/* <Box className="flex flex-col gap-4">
            <TextField
              label="DNI"
              variant="outlined"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              fullWidth
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              color="error"
              onClick={handleLogin}
              fullWidth
            >
              Ingresar
            </Button>
          </Box> */}
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
