"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-brand-blue"
          placeholder="voce@email.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-brand-blue"
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-brand-red bg-brand-red/10 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-brand-blue text-white font-medium py-3 hover:opacity-90 transition disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-sm text-center text-black/60">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="text-brand-blue font-medium">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
