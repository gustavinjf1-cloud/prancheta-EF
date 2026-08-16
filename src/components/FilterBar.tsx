"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

type Props = {
  faixasEtarias: string[];
  espacos: string[];
  bnccUnidades: string[];
};

const FILTER_KEYS = ["faixa", "espaco", "bncc", "q"] as const;

export function FilterBar({ faixasEtarias, espacos, bnccUnidades }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function setParam(key: (typeof FILTER_KEYS)[number], value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const hasFilters = FILTER_KEYS.some((k) => searchParams.get(k));

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-4 flex flex-col gap-3">
      <input
        type="search"
        placeholder="Buscar atividade..."
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => setParam("q", e.target.value)}
        className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select
          value={searchParams.get("faixa") ?? ""}
          onChange={(e) => setParam("faixa", e.target.value)}
          className="rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-blue bg-white"
        >
          <option value="">Faixa etária (todas)</option>
          {faixasEtarias.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <select
          value={searchParams.get("espaco") ?? ""}
          onChange={(e) => setParam("espaco", e.target.value)}
          className="rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-blue bg-white"
        >
          <option value="">Espaço (todos)</option>
          {espacos.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <select
          value={searchParams.get("bncc") ?? ""}
          onChange={(e) => setParam("bncc", e.target.value)}
          className="rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-blue bg-white"
        >
          <option value="">BNCC (todas)</option>
          {bnccUnidades.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      {hasFilters && (
        <button
          onClick={() => router.push(pathname)}
          className="self-start text-xs text-brand-red font-medium"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
