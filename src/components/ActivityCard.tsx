import Link from "next/link";
import { CourtIcon } from "./CourtIcon";
import type { Activity } from "@/lib/activities";

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Link
      href={`/atividades/${activity.slug}`}
      className="group flex gap-4 items-center bg-white rounded-2xl border border-black/5 p-4 hover:border-brand-blue/40 hover:shadow-sm transition"
    >
      <div className="w-14 h-[74px] shrink-0">
        <CourtIcon net={Boolean(activity.is_volei)} className="w-full h-full" />
      </div>
      <div className="min-w-0">
        <h3 className="font-bold leading-tight group-hover:text-brand-blue transition truncate">
          {activity.title}
        </h3>
        <p className="text-sm text-black/60 mt-1">{activity.faixa_etaria}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-[11px] font-medium bg-brand-blue/10 text-brand-blue rounded-full px-2 py-0.5">
            {activity.espaco}
          </span>
          <span className="text-[11px] font-medium bg-brand-orange/10 text-brand-orange rounded-full px-2 py-0.5">
            {activity.bncc}
          </span>
        </div>
      </div>
    </Link>
  );
}
