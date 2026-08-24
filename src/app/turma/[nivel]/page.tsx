import Link from "next/link";
import { notFound } from "next/navigation";
import { requireActiveSubscription } from "@/lib/access";
import { getNivel, faixasDisponiveis, COR_CLASSES } from "@/lib/turmas";

export default async function TurmaPage({ params }: PageProps<"/turma/[nivel]">) {
  await requireActiveSubscription();

  const { nivel: slug } = await params;
  const nivel = getNivel(slug);
  if (!nivel || !nivel.anos) notFound();

  const disponiveis = faixasDisponiveis();
  const cor = COR_CLASSES[nivel.cor];

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
      <Link href="/" className="text-sm text-brand-blue font-medium">
        ← Voltar
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{nivel.titulo}</h1>
        <p className="text-black/60 text-sm mt-1">Escolha o ano pra ver as atividades.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {nivel.anos.map((ano) => {
          const temConteudo = disponiveis.has(ano.faixaEtaria);

          if (!temConteudo) {
            return (
              <div
                key={ano.label}
                className="rounded-2xl border border-black/5 bg-white/60 p-5 text-center opacity-60"
              >
                <h2 className="font-bold">{ano.label}</h2>
                <span className="inline-block mt-2 text-[11px] font-medium bg-black/5 text-black/50 rounded-full px-2.5 py-1">
                  Em breve
                </span>
              </div>
            );
          }

          return (
            <Link
              key={ano.label}
              href={`/atividades?faixa=${encodeURIComponent(ano.faixaEtaria)}`}
              className={`group rounded-2xl border ${cor.border} ${cor.bg} p-5 text-center hover:shadow-md transition`}
            >
              <h2 className={`font-bold transition ${cor.hoverText}`}>{ano.label}</h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
