import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { isSubscriptionActive } from "@/lib/subscribers";
import { Logo } from "@/components/Logo";

export default async function AssinaturaPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  // Se a assinatura já estiver ativa (ex: acabou de confirmar o pagamento),
  // manda direto pro conteúdo em vez de deixar preso nessa tela.
  if (isSubscriptionActive(session.user.email)) redirect("/atividades");

  const checkoutUrl = process.env.KIWIFY_CHECKOUT_URL || "#";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <Logo />
        <h1 className="text-xl font-bold mt-2">Falta só a assinatura</h1>
        <p className="text-black/60 text-sm">
          Sua conta está criada, mas ainda não encontrei uma assinatura ativa pro
          e-mail <span className="font-medium text-brand-ink">{session.user.email}</span>.
        </p>
        <p className="text-black/60 text-sm">
          Se você já assinou, confere se usou esse mesmo e-mail na compra — pode
          levar alguns minutos pra confirmar. Se ainda não assinou, é só clicar
          abaixo.
        </p>

        <a
          href={checkoutUrl}
          className="mt-2 w-full rounded-full bg-brand-blue text-white font-medium py-3 hover:opacity-90 transition"
        >
          Assinar o Prancheta EF
        </a>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="text-sm text-black/40 hover:text-brand-red mt-2" type="submit">
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}
