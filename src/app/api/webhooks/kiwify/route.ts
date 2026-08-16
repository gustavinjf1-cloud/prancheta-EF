import { NextResponse } from "next/server";
import { upsertSubscriber, logWebhook, type SubscriberStatus } from "@/lib/subscribers";

export const runtime = "nodejs";

// Nomes de evento confirmados na documentação da Kiwify (docs.kiwify.com.br).
// Mapeamos pro nosso status interno. Qualquer evento fora dessa lista é
// ignorado (não muda status de ninguém), mas fica logado do mesmo jeito.
const EVENT_TO_STATUS: Record<string, SubscriberStatus> = {
  compra_aprovada: "active",
  subscription_renewed: "active",
  compra_recusada: "refused",
  compra_reembolsada: "canceled",
  chargeback: "canceled",
  subscription_canceled: "canceled",
  subscription_late: "late",
};

// order_status costuma vir junto no payload de pedidos — usamos como sinal
// extra caso o nome do evento não bata com a lista acima.
const ORDER_STATUS_TO_STATUS: Record<string, SubscriberStatus> = {
  paid: "active",
  approved: "active",
  refused: "refused",
  refunded: "canceled",
  chargedback: "canceled",
  canceled: "canceled",
};

function firstString(...candidates: unknown[]): string | undefined {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return undefined;
}

// Tenta achar um campo em alguns caminhos plausíveis do payload, sem travar
// se a Kiwify usar um formato um pouco diferente do esperado.
function extractEmail(body: Record<string, unknown>): string | undefined {
  const b = body as Record<string, Record<string, unknown> | undefined>;
  return firstString(
    (b.Customer as Record<string, unknown> | undefined)?.email,
    (b.customer as Record<string, unknown> | undefined)?.email,
    (b.Customer as Record<string, unknown> | undefined)?.mail,
    (b.buyer as Record<string, unknown> | undefined)?.email,
    body["customer_email"],
    body["email"],
  );
}

function extractEvent(body: Record<string, unknown>): string | undefined {
  return firstString(
    body["webhook_event_type"],
    body["event"],
    body["evento"],
    body["trigger"],
  );
}

function extractOrderStatus(body: Record<string, unknown>): string | undefined {
  const b = body as Record<string, Record<string, unknown> | undefined>;
  return firstString(
    body["order_status"],
    (b.Order as Record<string, unknown> | undefined)?.order_status,
    (b.order as Record<string, unknown> | undefined)?.status,
  );
}

function extractProduct(body: Record<string, unknown>): string | undefined {
  const b = body as Record<string, Record<string, unknown> | undefined>;
  return firstString(
    (b.Product as Record<string, unknown> | undefined)?.product_name,
    (b.product as Record<string, unknown> | undefined)?.name,
    (b.Subscription as Record<string, unknown> | undefined)?.plan as unknown,
  );
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!process.env.KIWIFY_WEBHOOK_TOKEN || token !== process.env.KIWIFY_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: "token inválido" }, { status: 401 });
  }

  const rawBody = await request.text();
  logWebhook("kiwify", rawBody);

  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ received: true, parsed: false }, { status: 200 });
  }

  const email = extractEmail(parsed);
  const eventName = extractEvent(parsed);
  const orderStatus = extractOrderStatus(parsed);
  const product = extractProduct(parsed) ?? null;

  const status =
    (eventName && EVENT_TO_STATUS[eventName]) ||
    (orderStatus && ORDER_STATUS_TO_STATUS[orderStatus]) ||
    undefined;

  if (email && status) {
    upsertSubscriber(email, status, product, eventName ?? orderStatus ?? null);
  }

  return NextResponse.json({
    received: true,
    parsed: {
      email: email ?? null,
      eventName: eventName ?? null,
      orderStatus: orderStatus ?? null,
      resolvedStatus: status ?? null,
      applied: Boolean(email && status),
    },
  });
}
