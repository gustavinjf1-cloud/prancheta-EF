import { db } from "./db";

export type Activity = {
  id: string;
  slug: string;
  title: string;
  faixa_etaria: string;
  espaco: string;
  bncc: string;
  descricao: string;
  materiais: string;
  dica: string;
  is_volei: number;
};

export type ActivityFilters = {
  faixaEtaria?: string;
  espaco?: string;
  bncc?: string;
  q?: string;
};

export function listActivities(filters: ActivityFilters = {}): Activity[] {
  const clauses: string[] = [];
  const params: string[] = [];

  if (filters.faixaEtaria) {
    clauses.push("faixa_etaria = ?");
    params.push(filters.faixaEtaria);
  }
  if (filters.espaco) {
    clauses.push("espaco = ?");
    params.push(filters.espaco);
  }
  if (filters.bncc) {
    clauses.push("bncc = ?");
    params.push(filters.bncc);
  }
  if (filters.q) {
    clauses.push("(title LIKE ? OR descricao LIKE ?)");
    const like = `%${filters.q}%`;
    params.push(like, like);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db()
    .prepare(`SELECT * FROM activities ${where} ORDER BY title ASC`)
    .all(...params) as Activity[];
}

export function getActivityBySlug(slug: string): Activity | undefined {
  return db().prepare("SELECT * FROM activities WHERE slug = ?").get(slug) as
    | Activity
    | undefined;
}

export function getActivitiesByIds(ids: string[]): Activity[] {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => "?").join(",");
  const rows = db()
    .prepare(`SELECT * FROM activities WHERE id IN (${placeholders})`)
    .all(...ids) as Activity[];
  // preserve the order passed in
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids.map((id) => byId.get(id)).filter((a): a is Activity => Boolean(a));
}

export function distinctValues(column: "faixa_etaria" | "espaco" | "bncc"): string[] {
  const rows = db()
    .prepare(`SELECT DISTINCT ${column} as v FROM activities ORDER BY ${column} ASC`)
    .all() as { v: string }[];
  return rows.map((r) => r.v);
}

// Ordem "pedagógica" das faixas etárias, pra não depender de ordem alfabética nos filtros.
export const FAIXA_ETARIA_ORDER = [
  "Infantil (4-6 anos)",
  "Fund. 1 (6-10 anos)",
  "Fund. 1-2 (8-12 anos)",
  "Fund. 2 (11-14 anos)",
  "Ensino Médio",
];

export const BNCC_UNIDADES = [
  "Brincadeiras e jogos",
  "Esportes",
  "Ginásticas",
  "Danças",
  "Lutas",
  "Práticas corporais de aventura",
];
