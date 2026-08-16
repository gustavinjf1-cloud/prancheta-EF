import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Logo } from "@/components/Logo";
import { SignupForm } from "./SignupForm";

export default async function CadastroPage() {
  const session = await auth();
  if (session?.user) redirect("/atividades");

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <h1 className="text-xl font-bold text-center mb-1">Cria sua conta</h1>
        <p className="text-center text-black/60 mb-6 text-sm">
          Grátis. Leva menos de um minuto.
        </p>
        <SignupForm />
      </div>
    </div>
  );
}
