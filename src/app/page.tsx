import Link from "next/link";
import { requireActiveSubscription } from "@/lib/access";
import { NIVEIS, faixasDisponiveis, nivelTemConteudo } from "@/lib/turmas";

export default async function Home() {
  await requireActiveSubscription();

  const disponiveis = faixasDisponiveis();

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">O que você vai dar aula hoje?</h1>
        <p className="text-black/60 text-sm mt-1">
          Escolha o nível de ensino pra ver as atividades separadas por ano.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {NIVEIS.map((nivel) => {
          const temConteudo = nivelTemConteudo(nivel, disponiveis);
          const href = nivel.linkDireto
            ? `/atividades?faixa=${encodeURIComponent(nivel.linkDireto)}`
            : `/turma/${nivel.slug}`;

          if (!temConteudo) {
            return (
              <div
                key={nivel.slug}
                className="rounded-2xl border border-black/5 bg-white/60 p-5 opacity-60"
              >
                <h2 className="font-bold text-lg">{nivel.titulo}</h2>
                <p className="text-sm text-black/50 mt-1">{nivel.subtitulo}</p>
                <span className="inline-block mt-3 text-[11px] font-medium bg-black/5 text-black/50 rounded-full px-2.5 py-1">
                  Em breve
                </span>
              </div>
            );
          }

          return (
            <Link
              key={nivel.slug}
              href={href}
              className="group rounded-2xl border border-black/5 bg-white p-5 hover:border-brand-blue/40 hover:shadow-sm transition"
            >
              <h2 className="font-bold text-lg group-hover:text-brand-blue transition">
                {nivel.titulo}
              </h2>
              <p className="text-sm text-black/60 mt-1">{nivel.subtitulo}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
