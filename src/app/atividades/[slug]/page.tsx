import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { requireActiveSubscription } from "@/lib/access";
import { getActivityBySlug } from "@/lib/activities";
import { getOrCreatePlan, isActivityInPlan } from "@/lib/plans";
import { CourtIcon } from "@/components/CourtIcon";
import { addToPlanAction, removeFromPlanAction } from "@/app/actions/plan";

export default async function AtividadePage({ params }: PageProps<"/atividades/[slug]">) {
  const session = await requireActiveSubscription();

  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  if (!activity) notFound();

  const userId = (session.user as { id?: string }).id!;
  const plan = getOrCreatePlan(userId);
  const inPlan = isActivityInPlan(plan.id, activity.id);

  const toggleAction = inPlan
    ? removeFromPlanAction.bind(null, activity.id)
    : addToPlanAction.bind(null, activity.id);

  return (
    <div className="max-w-2xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
      <Link href="/atividades" className="text-sm text-brand-blue font-medium">
        ← Voltar pras atividades
      </Link>

      <div className="bg-white rounded-2xl border border-black/5 p-6 flex flex-col sm:flex-row gap-6">
        <div className="w-28 shrink-0 mx-auto sm:mx-0 rounded-xl overflow-hidden bg-black/[0.03]">
          {activity.imagem ? (
            <Image
              src={activity.imagem}
              alt={activity.title}
              width={112}
              height={148}
              className="w-full h-auto object-cover"
            />
          ) : (
            <CourtIcon net={Boolean(activity.is_volei)} className="w-full h-auto" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold">{activity.title}</h1>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-xs font-medium bg-brand-blue/10 text-brand-blue rounded-full px-2.5 py-1">
              {activity.faixa_etaria}
            </span>
            <span className="text-xs font-medium bg-brand-orange/10 text-brand-orange rounded-full px-2.5 py-1">
              {activity.espaco}
            </span>
            <span className="text-xs font-medium bg-brand-yellow/10 text-[#8a6110] rounded-full px-2.5 py-1">
              {activity.bncc}
            </span>
          </div>

          <p className="mt-4 text-black/80 leading-relaxed">{activity.descricao}</p>

          <div className="mt-4">
            <h2 className="text-sm font-bold">Materiais</h2>
            <p className="text-sm text-black/70 mt-0.5">{activity.materiais}</p>
          </div>

          <div className="mt-3 bg-brand-yellow/10 rounded-xl p-3">
            <h2 className="text-sm font-bold">Dica</h2>
            <p className="text-sm text-black/70 mt-0.5">{activity.dica}</p>
          </div>

          <form action={toggleAction} className="mt-5">
            <button
              type="submit"
              className={`rounded-full font-medium px-5 py-2.5 transition ${
                inPlan
                  ? "bg-black/5 text-brand-red hover:bg-black/10"
                  : "bg-brand-blue text-white hover:opacity-90"
              }`}
            >
              {inPlan ? "Remover do plano de aula" : "Adicionar ao plano de aula"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
