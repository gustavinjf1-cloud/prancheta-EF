"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { createUser } from "@/lib/users";

export type AuthActionState = { error?: string } | undefined;

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirectTo: "/atividades" });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "E-mail ou senha incorretos." };
    }
    throw err;
  }

  return undefined;
}

export async function signupAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!name.trim() || !email.trim() || !password) {
    return { error: "Preenche nome, e-mail e senha." };
  }
  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }

  try {
    await createUser(name, email, password);
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    throw err;
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/atividades" });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Conta criada, mas não consegui entrar automaticamente. Tenta fazer login." };
    }
    throw err;
  }

  return undefined;
}
