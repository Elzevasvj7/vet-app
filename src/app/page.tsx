import { PawPrintIcon, Swords } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Elige tu asistente</p>
          <h1 className="text-3xl font-bold text-slate-900">Asistentes AI</h1>
          <p className="text-slate-600 max-w-2xl">Accede al asistente veterinario o al consejero de D&D.</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/vet-chat"
            className="group flex flex-col gap-3 p-5 rounded-2xl border border-amber-100 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 text-amber-800">
              <PawPrintIcon className="w-5 h-5" />
              <span className="font-semibold">Asistente Veterinario</span>
            </div>
            <p className="text-sm text-slate-600">Consejos generales de cuidado, salud y prevención para tus mascotas.</p>
            <span className="text-xs text-amber-700 group-hover:underline">Abrir</span>
          </Link>

          <Link
            href="/dnd"
            className="group flex flex-col gap-3 p-5 rounded-2xl border border-rose-100 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 text-rose-800">
              <Swords className="w-5 h-5" />
              <span className="font-semibold">Consejero D&D</span>
            </div>
            <p className="text-sm text-slate-600">Reglas, personajes y dudas rápidas de D&D 5e (PHB / SRD).</p>
            <span className="text-xs text-rose-700 group-hover:underline">Abrir</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
