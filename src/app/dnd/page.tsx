import { Sparkles, Swords } from "lucide-react";
import { DnDChat } from "../components/DnDChat";

export default function DnDPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black text-red-100">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-red-500">
            <Sparkles className="w-4 h-4" />
            <span>Guia de mesa</span>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-red-50 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
            Asistente D&D <Swords className="w-7 h-7" />
          </h1>
          <p className="text-red-200 max-w-2xl">
            Consulta reglas, crea personajes o resuelve dudas del Player's Handbook y SRD. Pensado para
            partidas rapidas sin perder la precision de las reglas oficiales.
          </p>
        </div>
        <DnDChat />
        <p className="text-xs text-red-400 text-center">
          Basado en SRD/Player's Handbook 5e. Confirma con tu DM para reglas de casa.
        </p>
      </div>
    </div>
  );
}
