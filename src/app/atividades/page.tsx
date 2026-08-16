import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listActivities, distinctValues, FAIXA_ETARIA_ORDER, BNCC_UNIDADES } from "@/lib/activities";
import { ActivityCard } from "@/components/ActivityCard";
import { FilterBar } from "@/components/FilterBar";

function orderFaixas(values: string[]): string[] {
  return [...values].sort(
    (a, b) => FAIXA_ETARIA_ORDER.indexOf(a) - FAIXA_ETARIA_ORDER.indexOf(b),
  );
}

function orderBncc(values: string[]): string[] {
  return [...values].sort(
    (a, b) => BNCC_UNIDADES.indexOf(a) - BNCC_UNIDADES.indexOf(b),
  );
}

export default async function AtividadesPage({
  searchParams,
}: PageProps<"/atividades">) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sp = await searchParams;
  const faixa = typeof sp.faixa === "string" ? sp.faixa : undefined;
  const espaco = typeof sp.espaco === "string" ? sp.espaco : undefined;
  const bncc = typeof sp.bncc === "string" ? sp.bncc : undefined;
  const q = typeof sp.q === "string" ? sp.q : undefined;

  const activities = listActivities({ faixaEtaria: faixa, espaco, bncc, q });
  const faixasEtarias = orderFaixas(distinctValues("faixa_etaria"));
  const espacos = distinctValues("espaco");
  const bnccUnidades = orderBncc(distinctValues("bncc"));

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Atividades</h1>
        <p className="text-black/60 text-sm mt-1">
          Filtra por faixa etária, espaço disponível ou unidade da BNCC e monta sua aula.
        </p>
      </div>

      <FilterBar faixasEtarias={faixasEtarias} espacos={espacos} bnccUnidades={bnccUnidades} />

      {activities.length === 0 ? (
        <p className="text-center text-black/50 py-16">
          Nenhuma atividade encontrada com esses filtros.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      )}
    </div>
  );
}
