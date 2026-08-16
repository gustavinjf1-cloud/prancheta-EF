import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

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
      is_volei INTEGER NOT NULL DEFAULT 0
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
  `);
}

type SeedActivity = {
  slug: string;
  title: string;
  faixaEtaria: string;
  espaco: string;
  bncc: string;
  descricao: string;
  materiais: string;
  dica: string;
  isVolei?: boolean;
};

const SEED_ACTIVITIES: SeedActivity[] = [
  {
    slug: "queimada-adaptada",
    title: "Queimada Adaptada",
    faixaEtaria: "Fund. 1 (6-10 anos)",
    espaco: "Quadra ou pátio",
    bncc: "Brincadeiras e jogos",
    descricao:
      "Clássica, mas com ajustes pra funcionar em turmas grandes e espaços menores. Divida a turma em dois times; quem for atingido vai pro \"banco\" do time adversário e pode voltar se o próprio time pegar a bola no ar.",
    materiais: "1 bola de borracha macia (ou de vôlei leve)",
    dica: "Em turmas muito grandes, use duas bolas ao mesmo tempo pra manter todo mundo em movimento.",
  },
  {
    slug: "circuito-equilibrio",
    title: "Circuito de Equilíbrio com Cones",
    faixaEtaria: "Infantil (4-6 anos)",
    espaco: "Sala ampla ou pátio",
    bncc: "Ginásticas",
    descricao:
      "Monte um circuito com cones, fita no chão e bambolês. As crianças percorrem em fila, trabalhando equilíbrio, coordenação motora e noção espacial, sem precisar de material caro.",
    materiais: "Cones, fita crepe ou giz, bambolês (opcional)",
    dica: "Varie o circuito toda semana — só trocar a ordem das estações já renova o interesse da turma.",
  },
  {
    slug: "volei-balao-dupla",
    title: "Vôlei com Balão em Dupla",
    faixaEtaria: "Fund. 1-2 (8-12 anos)",
    espaco: "Quadra pequena ou sala",
    bncc: "Esportes",
    descricao:
      "Introduz os fundamentos do vôlei sem a pressão da bola oficial — o balão desacelera o jogo e dá tempo de todo mundo participar. Em duplas, cada lado precisa se organizar pra não deixar o balão cair.",
    materiais: "1 balão por dupla, barbante ou rede baixa (opcional)",
    dica: "Combine um número mínimo de toques antes de passar pro outro lado — isso força a cooperação dentro da dupla.",
    isVolei: true,
  },
  {
    slug: "danca-das-cadeiras-cooperativa",
    title: "Dança das Cadeiras Cooperativa",
    faixaEtaria: "Infantil (4-6 anos)",
    espaco: "Sala ampla ou pátio",
    bncc: "Danças",
    descricao:
      "Versão sem eliminação da clássica dança das cadeiras: a cada rodada tira-se uma cadeira, mas todo mundo continua brincando dividindo o espaço que sobra. Termina quando só resta uma cadeira pra turma toda.",
    materiais: "Cadeiras (uma a menos que o número de alunos) e música",
    dica: "Funciona também com bambolês no chão no lugar das cadeiras, se o espaço for apertado.",
  },
  {
    slug: "luta-de-fita-cooperativa",
    title: "Luta de Fitas em Dupla",
    faixaEtaria: "Fund. 2 (11-14 anos)",
    espaco: "Quadra ou pátio",
    bncc: "Lutas",
    descricao:
      "Cada aluno prende uma fita na cintura (por fora da roupa) e o objetivo é pegar a fita do colega sem deixar pegarem a sua. Introduz noções de esquiva, distância e contato controlado das lutas, sem contato físico direto.",
    materiais: "2 fitas de tecido ou TNT por dupla",
    dica: "Reforce as regras de segurança antes de começar — sem empurrar, sem segurar o colega, só a fita.",
  },
  {
    slug: "trilha-de-obstaculos-aventura",
    title: "Trilha de Obstáculos",
    faixaEtaria: "Fund. 1 (6-10 anos)",
    espaco: "Pátio ou área externa",
    bncc: "Práticas corporais de aventura",
    descricao:
      "Um percurso com obstáculos simples (bancos, cones, pneus, cordas no chão) pra escalar, desviar e equilibrar. Introduz noções de risco calculado e superação de desafios físicos de forma segura.",
    materiais: "Bancos, cones, pneus ou cordas — o que tiver disponível na escola",
    dica: "Deixe as próprias crianças ajudarem a montar o percurso — aumenta o engajamento e o senso de pertencimento.",
  },
  {
    slug: "handebol-adaptado-em-time",
    title: "Handebol Adaptado 4x4",
    faixaEtaria: "Ensino Médio",
    espaco: "Quadra",
    bncc: "Esportes",
    descricao:
      "Versão reduzida do handebol, com times menores e regras simplificadas, pra aumentar o número de toques na bola por aluno e o ritmo do jogo em turmas grandes.",
    materiais: "1 bola de handebol (ou similar)",
    dica: "Faça rodízio de times a cada gol — mantém todo mundo envolvido mesmo em turmas com muitos alunos de fora.",
  },
];

function seed(db: DatabaseSync) {
  const { count } = db.prepare("SELECT COUNT(*) as count FROM activities").get() as {
    count: number;
  };
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO activities (id, slug, title, faixa_etaria, espaco, bncc, descricao, materiais, dica, is_volei)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const a of SEED_ACTIVITIES) {
    insert.run(
      crypto.randomUUID(),
      a.slug,
      a.title,
      a.faixaEtaria,
      a.espaco,
      a.bncc,
      a.descricao,
      a.materiais,
      a.dica,
      a.isVolei ? 1 : 0,
    );
  }
}

export function db() {
  return getDb();
}

export function newId() {
  return crypto.randomUUID();
}
