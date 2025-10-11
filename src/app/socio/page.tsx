"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function SocioPage() {
  const { data: session } = useSession();

  return (
    <div className="h-screen">
      <header className="h-1/8 flex items-center justify-between px-14 bg-[#124559] w-full">
        <h1 className="text-2xl font-bold text-white">BahiaBlanca Club</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-white hover:text-rose-600"
        >
          <LogoutIcon />
        </button>
      </header>
      <div className="flex h-7/8 p-8 w-screen flex-wrap">
        <div className="w-1/2 flex justify-center flex-col gap-4 items-center">
          <Image
            src="/practica.webp"
            width={300}
            height={300}
            alt="practica deportiva imagen"
          ></Image>
          <Link
            href=""
            className="bg-gray-900 text-white p-2 rounded-xl hover:scale-105 transition duration-300"
          >
            Practicas deportivas
          </Link>
        </div>
        <div className="w-1/2 flex justify-center flex-col gap-4 items-center">
          <Image
            src="/cancha.webp"
            width={300}
            height={300}
            alt="imagen cancha"
          ></Image>
          <Link
            href=""
            className="bg-gray-900 text-white p-2 rounded-xl hover:scale-105 transition duration-300"
          >
            Alquiler de canchas
          </Link>
        </div>
        <div className="w-1/2 flex justify-center flex-col gap-4 items-center">
          <Image
            src="/usuarios.webp"
            width={300}
            height={300}
            alt="imagen usuario"
          ></Image>
          <Link
            href=""
            className="bg-gray-900 text-white p-2 rounded-xl hover:scale-105 transition duration-300"
          >
            Perfil de usuario: {session?.user?.name}
          </Link>
        </div>
        <div className="w-1/2 flex justify-center flex-col gap-4 items-center">
          <Image src="/pagos.webp" width={300} height={300} alt="pagos"></Image>
          <Link
            href=""
            className="bg-gray-900 text-white p-2 rounded-xl hover:scale-105 transition duration-300"
          >
            Pagos
          </Link>
        </div>
      </div>
    </div>
  );
}
