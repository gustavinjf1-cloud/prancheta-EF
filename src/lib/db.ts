import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import seedActivitiesData from "@/data/atividades-seed.json";

// Banco local em arquivo (SQLite embutido no Node — zero dependências externas).
// Pra produção com mais de um servidor/instância, trocar por um Postgres gerenciado
// (ver GUIA_DEPLOY.md) é o próximo passo natural — mas pra validar o app com as
// primeiras professoras, isso já resolve.

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, "app.db");

declare global {
  // eslint-disable-next-line no-var
  var __prancheta_db__: DatabaseSync | undefined;
}

function getDb(): DatabaseSync {
  if (!global.__prancheta_db__) {
    const db = new DatabaseSync(DB_PATH);
    db.exec("PRAGMA journal_mode = WAL;");
    migrate(db);
    seed(db);
    global.__prancheta_db__ = db;
  }
  return global.__prancheta_db__;
}

function migrate(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      faixa_etaria TEXT NOT NULL,
      espaco TEXT NOT NULL,
      bncc TEXT NOT NULL,
      descricao TEXT NOT NULL,
      materiais TEXT NOT NULL,
      dica TEXT NOT NULL,
      is_volei INTEGER NOT NULL DEFAULT 0,
      imagem TEXT
    );

    CREATE TABLE IF NOT EXISTS lesson_plans (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS lesson_plan_activities (
      plan_id TEXT NOT NULL REFERENCES lesson_plans(id) ON DELETE CASCADE,
      activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
      position INTEGER NOT NULL,
      PRIMARY KEY (plan_id, activity_id)
    );

    -- Controlado só pelos webhooks da Kiwify. Guardamos por e-mail (não por
    -- user_id) porque o aviso de pagamento pode chegar antes ou depois da
    -- professora criar a conta no app — o e-mail é o que liga as duas pontas.
    CREATE TABLE IF NOT EXISTS subscribers (
      email TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      product TEXT,
      last_event TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Guarda o corpo bruto de cada webhook recebido, pra gente conseguir
    -- conferir o formato real do payload da Kiwify e depurar sem precisar
    -- vasculhar log de servidor.
    CREATE TABLE IF NOT EXISTS webhook_logs (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      received_at TEXT NOT NULL DEFAULT (datetime('now')),
      body TEXT NOT NULL
    );
  `);

  // Banco já existia sem a coluna `imagem` (deploys anteriores) — adiciona se faltar.
  const activityCols = db.prepare("PRAGMA table_info(activities)").all() as {
    name: string;
  }[];
  if (!activityCols.some((c) => c.name === "imagem")) {
    db.exec("ALTER TABLE activities ADD COLUMN imagem TEXT;");
  }
}

type SeedActivity = {
  slug: string;
  title: string;
  faixa_etaria: string;
  espaco: string;
  bncc: string;
  descricao: string;
  materiais: string;
  dica: string;
  imagem: string | null;
};

const SEED_ACTIVITIES = seedActivitiesData as unknown as SeedActivity[];

// Atividades de demonstração do scaffolding inicial do app — taxonomia antiga,
// incompatível com o banco de atividades real. Removidas assim que o banco
// de verdade é semeado.
const LEGACY_DEMO_SLUGS = [
  "queimada-adaptada",
  "circuito-equilibrio",
  "volei-balao-dupla",
  "danca-das-cadeiras-cooperativa",
  "luta-de-fita-cooperativa",
  "trilha-de-obstaculos-aventura",
  "handebol-adaptado-em-time",
];

function seed(db: DatabaseSync) {
  const placeholders = LEGACY_DEMO_SLUGS.map(() => "?").join(",");
  db.prepare(`DELETE FROM activities WHERE slug IN (${placeholders})`).run(
    ...LEGACY_DEMO_SLUGS,
  );

  const upsert = db.prepare(`
    INSERT INTO activities (id, slug, title, faixa_etaria, espaco, bncc, descricao, materiais, dica, is_volei, imagem)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      faixa_etaria = excluded.faixa_etaria,
      espaco = excluded.espaco,
      bncc = excluded.bncc,
      descricao = excluded.descricao,
      materiais = excluded.materiais,
      dica = excluded.dica,
      imagem = excluded.imagem
  `);
  for (const a of SEED_ACTIVITIES) {
    upsert.run(
      crypto.randomUUID(),
      a.slug,
      a.title,
      a.faixa_etaria,
      a.espaco,
      a.bncc,
      a.descricao,
      a.materiais,
      a.dica,
      a.imagem,
    );
  }
}

export function db() {
  return getDb();
}

export function newId() {
  return crypto.randomUUID();
}
