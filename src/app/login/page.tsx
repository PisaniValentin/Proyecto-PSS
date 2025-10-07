"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
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
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center h-max"
    >
      <div className="p-10 flex flex-col gap-1">
        <h1 className="font-bold  text-4xl self-center">Sign In</h1>
        <h2 className=" text-xl self-center mb-4">Hola! Bienvenido</h2>
        <label className="text-md font-bold" htmlFor="email">
          Email:{" "}
        </label>
        <div className="border-1 rounded-[20px] input-border mb-4">
          <input
            className=" w-full p-1 pl-4"
            name="email"
            type="email"
            id="email"
            placeholder="something@gmail.com"
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
          <div className="">Log in</div>
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

        <h5 className=" text-center">
          No tienes cuenta?
          <Link href={""} className="pl-2  underline">
            Registrate
          </Link>
        </h5>
      </div>
    </form>
  );
}
