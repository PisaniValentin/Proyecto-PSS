"use client";

import { useRouter } from "next/navigation";

export default function CanchasHome() {
    const router = useRouter();

    const cards = [
        {
            title: "Alta cancha",
            description: "Crear una nueva cancha en el sistema.",
            iconSrc: "/add.png",
            onClick: () => router.push("/admin/otros/canchas/alta"),
            gradient: "bg-[linear-gradient(135deg,#34d399_0%,#22c55e_100%)]", // verde sutil
        },
        {
            title: "Editar cancha",
            description: "Modificar datos existentes.",
            iconSrc: "/edit.webp",
            onClick: () => router.push("/admin/otros/canchas/editar"),
            gradient: "bg-[linear-gradient(135deg,#fcd34d_0%,#D9BA14_100%)]",
        },
        {
            title: "Baja cancha",
            description: "Eliminar una cancha del sistema.",
            iconSrc: "/trash.webp",
            onClick: () => router.push("/admin/otros/canchas/baja"),
            gradient: "bg-[linear-gradient(135deg,#f87171_0%,#ef4444_100%)]",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
            <header className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Administración de canchas</h1>
                <p className="text-gray-700 text-lg">Elegí una acción</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        onClick={card.onClick}
                        className={`relative flex flex-col items-center justify-center w-72 h-56 rounded-xl text-white cursor-pointer shadow-lg transform transition-all duration-300 ${card.gradient} hover:-translate-y-3 hover:shadow-2xl`}
                    >
                        {/* Imagen decorativa */}
                        <img
                            src={card.iconSrc}
                            alt={card.title}
                            className="h-20 mb-3 filter drop-shadow-lg transition-transform duration-300 hover:scale-110"
                        />

                        {/* Texto */}
                        <h2 className="text-xl font-bold text-center">{card.title}</h2>
                        <p className="text-sm text-center px-4 mt-2">{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
