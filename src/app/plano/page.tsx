import Link from "next/link";
import { requireActiveSubscription } from "@/lib/access";
import { getOrCreatePlan, getPlanActivities } from "@/lib/plans";
import { CourtIcon } from "@/components/CourtIcon";
import { removeFromPlanAction } from "@/app/actions/plan";
import { RenamePlanForm } from "./RenamePlanForm";

export default async function PlanoPage() {
  const session = await requireActiveSubscription();

  const userId = (session.user as { id?: string }).id!;
  const plan = getOrCreatePlan(userId);
  const activities = getPlanActivities(plan.id);

  return (
    <div className="max-w-2xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 min-w-0">
        <RenamePlanForm initialTitle={plan.title} />
        {activities.length > 0 && (
          <Link
            href="/plano/imprimir"
            target="_blank"
            className="shrink-0 rounded-full bg-brand-blue text-white text-sm font-medium px-4 py-2.5 hover:opacity-90 transition"
          >
            Exportar PDF
          </Link>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-black/50 mb-4">
            Seu plano de aula está vazio. Adicione atividades pra começar.
          </p>
          <Link href="/atividades" className="text-brand-blue font-medium">
            Ver atividades →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {activities.map((a) => (
            <div
              key={a.id}
              className="flex gap-4 items-center bg-white rounded-2xl border border-black/5 p-4"
            >
              <div className="w-12 h-16 shrink-0">
                <CourtIcon net={Boolean(a.is_volei)} className="w-full h-full" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold leading-tight truncate">{a.title}</h3>
                <p className="text-sm text-black/60 mt-0.5">
                  {a.faixa_etaria} · {a.espaco}
                </p>
              </div>
              <form action={removeFromPlanAction.bind(null, a.id)}>
                <button
                  type="submit"
                  className="text-xs text-brand-red font-medium shrink-0"
                >
                  Remover
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
