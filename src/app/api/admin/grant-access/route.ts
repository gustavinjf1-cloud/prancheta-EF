import { NextResponse } from "next/server";
import { upsertSubscriber, type SubscriberStatus } from "@/lib/subscribers";

export const runtime = "nodejs";

// Rota de uso só do dono do app: libera (ou revoga) acesso de um e-mail sem
// precisar passar pela Kiwify — útil pra testes, cortesias, professoras piloto,
// etc. Protegida por um segredo separado do KIWIFY_WEBHOOK_TOKEN de propósito,
// pra não mexer na integração de pagamento de verdade.
const VALID_STATUSES: SubscriberStatus[] = [
  "active",
  "inactive",
  "canceled",
  "refused",
  "late",
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (!process.env.ADMIN_GRANT_SECRET || secret !== process.env.ADMIN_GRANT_SECRET) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }

  const email = url.searchParams.get("email")?.trim();
  const statusParam = (url.searchParams.get("status") ?? "active") as SubscriberStatus;

  if (!email) {
    return NextResponse.json({ error: "informe ?email=" }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(statusParam)) {
    return NextResponse.json(
      { error: `status inválido, use um de: ${VALID_STATUSES.join(", ")}` },
      { status: 400 },
    );
  }

  upsertSubscriber(email, statusParam, "admin-grant", "admin_grant");

  return NextResponse.json({ ok: true, email, status: statusParam });
}
