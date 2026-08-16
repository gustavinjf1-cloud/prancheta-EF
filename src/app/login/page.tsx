import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/atividades");

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <h1 className="text-xl font-bold text-center mb-1">Bem-vindo(a) de volta</h1>
        <p className="text-center text-black/60 mb-6 text-sm">
          Entra pra ver as atividades e montar seu plano de aula.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
