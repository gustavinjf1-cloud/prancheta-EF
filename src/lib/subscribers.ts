import { db, newId } from "./db";

// Status possíveis: "active" (libera acesso), "inactive"/"canceled"/"refused"
// (bloqueia), "late" (pagamento atrasado — bloqueia, mas fica distinto de
// cancelado de propósito pra facilitar suporte/relatório depois).
export type SubscriberStatus = "active" | "inactive" | "canceled" | "refused" | "late";

export type Subscriber = {
  email: string;
  status: SubscriberStatus;
  product: string | null;
  last_event: string | null;
  updated_at: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function upsertSubscriber(
  email: string,
  status: SubscriberStatus,
  product: string | null,
  lastEvent: string | null,
) {
  const normalizedEmail = normalizeEmail(email);
  db()
    .prepare(
      `INSERT INTO subscribers (email, status, product, last_event, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'))
       ON CONFLICT(email) DO UPDATE SET
         status = excluded.status,
         product = excluded.product,
         last_event = excluded.last_event,
         updated_at = datetime('now')`,
    )
    .run(normalizedEmail, status, product, lastEvent);
}

export function isSubscriptionActive(email: string): boolean {
  const row = db()
    .prepare("SELECT status FROM subscribers WHERE email = ?")
    .get(normalizeEmail(email)) as { status: SubscriberStatus } | undefined;
  return row?.status === "active";
}

export function logWebhook(source: string, body: string) {
  db()
    .prepare("INSERT INTO webhook_logs (id, source, body) VALUES (?, ?, ?)")
    .run(newId(), source, body);
}
