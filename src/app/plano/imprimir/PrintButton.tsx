"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print rounded-full bg-brand-blue text-white text-sm font-medium px-5 py-2.5 hover:opacity-90 transition"
    >
      Baixar / imprimir PDF
    </button>
  );
}
