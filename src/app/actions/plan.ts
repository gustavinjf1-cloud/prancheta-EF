"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  getOrCreatePlan,
  addActivityToPlan,
  removeActivityFromPlan,
  renamePlan,
} from "@/lib/plans";

async function requireUserId(): Promise<string> {
  const session = await auth();
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) throw new Error("Não autenticado.");
  return id;
}

export async function addToPlanAction(activityId: string) {
  const userId = await requireUserId();
  const plan = getOrCreatePlan(userId);
  addActivityToPlan(plan.id, activityId);
  revalidatePath("/atividades");
  revalidatePath("/plano");
}

export async function removeFromPlanAction(activityId: string) {
  const userId = await requireUserId();
  const plan = getOrCreatePlan(userId);
  removeActivityFromPlan(plan.id, activityId);
  revalidatePath("/atividades");
  revalidatePath("/plano");
}

export async function renamePlanAction(_prevState: unknown, formData: FormData) {
  const userId = await requireUserId();
  const plan = getOrCreatePlan(userId);
  const title = String(formData.get("title") ?? "");
  renamePlan(plan.id, title);
  revalidatePath("/plano");
  return { ok: true };
}
