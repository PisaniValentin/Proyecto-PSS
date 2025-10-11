import Image from "next/image";
import Link from "next/link";
export default function EntrenadorPerfil() {
  return (
    <div className="flex justify-center items-center flex-col gap-8 mt-20">
      <h1 className="text-5xl">Página en Construcción</h1>
      <Image
        src="/barrera.png"
        alt="trabajo en progreso"
        width={400}
        height={400}
      ></Image>
      <Link
        href="/entrenador"
        className="bg-gray-900 text-white p-2 rounded-xl hover:scale-105 transition duration-300"
      >
        Volver
      </Link>
    </div>
  );
}
