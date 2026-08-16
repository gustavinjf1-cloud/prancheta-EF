import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isSubscriptionActive } from "./subscribers";

// Usado em toda página protegida (atividades, plano). Garante login E
// assinatura ativa — quem só tem conta mas não pagou (ou cancelou) é
// mandado pra tela de assinatura, não pro conteúdo.
export async function requireActiveSubscription() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }
  if (!isSubscriptionActive(session.user.email)) {
    redirect("/assinatura");
  }
  return session;
}
