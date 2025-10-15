import Link from "next/link";

export default function OtrosPage() {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-10">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl border border-gray-200 p-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">Otros</h1>
                <p className="text-sm text-gray-600 mb-6">
                    Elegí una opción para continuar
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                        href="/admin/otros/canchas"
                        className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 px-4 py-3 text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                        Canchas
                    </Link>

                    <Link
                        href="/admin/otros/perfil"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-800 px-4 py-3 text-sm font-medium hover:bg-slate-100 transition-colors"
                    >
                        Ver perfil usuario
                    </Link>

                    <Link
                        href="/admin/otros/turnos"
                        className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-medium hover:bg-emerald-100 transition-colors"
                    >
                        Agenda de turnos
                    </Link>
                </div>
            </div>
        </div>
    );
}