import type { Metadata, Viewport } from "next";
import { poppins } from "@/lib/fonts";
import { auth, signOut } from "@/auth";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prancheta EF",
  description: "Banco de atividades de Educação Física escolar por faixa etária, espaço e BNCC.",
  manifest: "/manifest.json",
  appleWebApp: {
    // iOS não lê o manifest.json pra instalar -- essas tags são o
    // equivalente que o Safari entende quando alguém faz "Adicionar à
    // Tela de Início".
    capable: true,
    statusBarStyle: "default",
    title: "Prancheta EF",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#378ADD",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html lang="pt-BR" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-brand-offwhite text-brand-ink">
        <RegisterServiceWorker />
        {session?.user && (
          <nav className="border-b border-black/5 bg-white">
            <div className="h-1.5 bg-[linear-gradient(90deg,var(--color-blue)_0%,var(--color-blue)_25%,var(--color-yellow)_25%,var(--color-yellow)_50%,var(--color-orange)_50%,var(--color-orange)_75%,var(--color-red)_75%,var(--color-red)_100%)]" />
            <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
              <Link href="/">
                <Logo />
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/" className="hover:text-brand-blue">
                  Início
                </Link>
                <Link href="/atividades" className="hover:text-brand-blue">
                  Atividades
                </Link>
                <Link href="/plano" className="hover:text-brand-blue">
                  Meu plano
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                  }}
                >
                  <button className="text-black/50 hover:text-brand-red" type="submit">
                    Sair
                  </button>
                </form>
              </div>
            </div>
          </nav>
        )}
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
