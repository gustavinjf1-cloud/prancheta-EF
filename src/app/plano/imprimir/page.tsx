import { requireActiveSubscription } from "@/lib/access";
import { getOrCreatePlan, getPlanActivities } from "@/lib/plans";
import { CourtIcon } from "@/components/CourtIcon";
import { Logo } from "@/components/Logo";
import { PrintButton } from "./PrintButton";

export default async function ImprimirPlanoPage() {
  const session = await requireActiveSubscription();

  const userId = (session.user as { id?: string }).id!;
  const plan = getOrCreatePlan(userId);
  const activities = getPlanActivities(plan.id);
  const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="max-w-2xl w-full mx-auto px-4 py-8 flex flex-col gap-6 bg-white">
      <div className="no-print flex justify-end">
        <PrintButton />
      </div>

      <header className="flex items-center justify-between border-b border-black/10 pb-4">
        <Logo />
        <p className="text-xs text-black/50">{dataFormatada}</p>
      </header>

      <h1 className="text-2xl font-bold">{plan.title}</h1>

      {activities.length === 0 ? (
        <p className="text-black/50">Esse plano ainda não tem atividades.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {activities.map((a, i) => (
            <section key={a.id} className="flex gap-5 break-inside-avoid">
              <div className="w-16 shrink-0">
                <CourtIcon net={Boolean(a.is_volei)} className="w-full h-auto" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-lg">
                  {i + 1}. {a.title}
                </h2>
                <p className="text-sm text-black/60 mt-0.5">
                  {a.faixa_etaria} · {a.espaco} · BNCC: {a.bncc}
                </p>
                <p className="text-sm text-black/80 mt-2 leading-relaxed">{a.descricao}</p>
                <p className="text-sm mt-2">
                  <span className="font-bold">Materiais: </span>
                  <span className="text-black/70">{a.materiais}</span>
                </p>
                <p className="text-sm mt-1">
                  <span className="font-bold">Dica: </span>
                  <span className="text-black/70">{a.dica}</span>
                </p>
              </div>
            </section>
          ))}
        </div>
      )}

      <footer className="no-print text-center text-xs text-black/40 pt-6">
        Gerado pelo Prancheta EF
      </footer>
    </div>
  );
}
