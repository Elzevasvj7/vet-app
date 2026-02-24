"use client";
import { ScrollText, Shield } from "lucide-react";
import React from "react";
import { generateQuery } from "../actions";

const D20Icon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 21 8 17 20 7 20 3 8" />
    <path d="M12 2 12 8 21 8" />
    <path d="M12 8 7 20" />
    <path d="M12 8 17 20" />
  </svg>
);

export const DnDChat = () => {
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [parsing, setParsing] = React.useState(false);
  const [error, setError] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [fileText, setFileText] = React.useState("");

  const extractPdfText = async (file: File) => {
    try {
      const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
      GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({
        data: arrayBuffer,
        disableWorker: true,
      } as any).promise;

      const maxPages = Math.min(pdf.numPages, 20);
      let text = "";

      for (let i = 1; i <= maxPages && text.length < 12000; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = (content.items as any[])
          .map((item) => ("str" in item ? (item as any).str : ""))
          .join(" ");
        text += pageText + "\n\n";
      }

      return text.slice(0, 12000);
    } catch (err) {
      console.error("PDF parse error", err);
      return "";
    }
  };

  const handleFile = async (file: File) => {
    setParsing(true);
    if (!file) {
      setParsing(false);
      return;
    }
    try {
      if (file.type.startsWith("text")) {
        const text = await file.text();
        setFileName(file.name);
        setFileText(text.slice(0, 12000));
        setError("");
      } else if (file.type === "application/pdf") {
        const text = await extractPdfText(file);
        if (!text.trim()) {
          setError("No se pudo extraer texto del PDF.");
          setFileName("");
          setFileText("");
        } else {
          setFileName(file.name);
          setFileText(text);
          setError("");
        }
      } else {
        setError("Solo se aceptan .txt, .md o .pdf");
        setFileName("");
        setFileText("");
      }
    } catch (err) {
      setError("No se pudo leer el archivo");
      setFileName("");
      setFileText("");
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setAnswer("");

    if (!input.trim() && !fileText.trim()) {
      setError("Escribe una pregunta o adjunta un archivo de texto.");
      setLoading(false);
      return;
    }
    const withDoc = fileText
      ? `${input}\n\n[Documento: ${fileName}]\n${fileText}`
      : input;
    try {
      const result = await generateQuery(withDoc);
      setAnswer(result || "No se obtuvo respuesta.");
      setInput("");
    } catch (err) {
      setError("No se pudo generar la respuesta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-3xl bg-gradient-to-br from-rose-50 via-amber-50 to-slate-50 border border-rose-200 rounded-3xl p-6 text-slate-900">
      <div className="flex items-center gap-3 text-rose-900 uppercase tracking-[0.14em]">
        <Shield className="w-5 h-5" />
        <h2 className="font-semibold text-xl">Consejero D&D</h2>
      </div>
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label className="sr-only" htmlFor="dnd-input">
          Pregunta sobre D&D
        </label>
        <div className="flex flex-col gap-2">
          <input
            id="dnd-input"
            className="w-full p-3 border-1 border-slate-200 rounded-2xl bg-white/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
            value={input}
            type="text"
            placeholder="Ejemplo: ¿Cómo funciona la ventaja? o crea un personaje nivel 3."
            onChange={(e) => setInput(e.target.value)}
          />
          <label className="text-xs text-rose-800" htmlFor="dnd-file">
            Adjunta un archivo de texto o PDF para analizar (se recorta a 12k caracteres)
          </label>
          <input
            id="dnd-file"
            type="file"
            accept=".txt,.md,text/plain,text/markdown,application/pdf"
            className="text-slate-800 text-sm file:mr-3 file:px-3 file:py-2 file:rounded-xl file:border file:border-rose-300 file:bg-rose-100 file:text-rose-900 file:hover:bg-rose-200"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await handleFile(file);
            }}
          />
          {fileName && (
            <div className="text-xs text-rose-800 flex items-center gap-2">
              <ScrollText className="w-4 h-4" />
              <span>Adjunto: {fileName}</span>
            </div>
          )}
          <div className="flex justify-end">
            <button disabled={loading || parsing} className="px-4 py-2 bg-rose-700 text-white rounded-2xl hover:bg-rose-800 transition shadow shadow-rose-400/50 disabled:opacity-60">
              Enviar
            </button>
          </div>
        </div>
      </form>
      {error && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{error}</p>}
      {parsing && <p className="text-sm text-rose-800">Extrayendo texto del archivo...</p>}
      <div className="min-h-40 max-h-80 overflow-y-auto flex flex-col gap-4 pr-1 bg-white/90 border border-rose-100 rounded-2xl p-4 shadow-inner shadow-rose-100/70">
        {loading && (
          <div className="flex items-center gap-2 text-rose-700">
            <D20Icon className="w-5 h-5 animate-spin" />
            <p className="text-sm">Forjando la respuesta...</p>
          </div>
        )}
        {!loading && answer && (
          <div className="flex items-start gap-3 text-slate-900">
            <ScrollText className="w-5 h-5 flex-shrink-0 text-rose-700" />
            <div className="text-sm leading-relaxed whitespace-pre-wrap font-serif">{answer}</div>
          </div>
        )}
        {!loading && !answer && (
          <p className="text-sm text-slate-500">Aun no hay respuesta. Escribe tu consulta y opcionalmente adjunta un texto.</p>
        )}
      </div>
    </div>
  );
};
