import { db, newId } from "./db";
import { getActivitiesByIds, type Activity } from "./activities";

export type LessonPlan = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
};

// MVP: cada professor(a) tem um único plano de aula "ativo" por vez — funciona
// como um carrinho. Dá pra evoluir pra múltiplos planos nomeados depois.
export function getOrCreatePlan(userId: string): LessonPlan {
  const existing = db()
    .prepare("SELECT * FROM lesson_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1")
    .get(userId) as LessonPlan | undefined;
  if (existing) return existing;

  const id = newId();
  db()
    .prepare("INSERT INTO lesson_plans (id, user_id, title) VALUES (?, ?, ?)")
    .run(id, userId, "Meu plano de aula");
  return db().prepare("SELECT * FROM lesson_plans WHERE id = ?").get(id) as LessonPlan;
}

export function getPlanActivities(planId: string): Activity[] {
  const rows = db()
    .prepare(
      "SELECT activity_id FROM lesson_plan_activities WHERE plan_id = ? ORDER BY position ASC",
    )
    .all(planId) as { activity_id: string }[];
  return getActivitiesByIds(rows.map((r) => r.activity_id));
}

export function isActivityInPlan(planId: string, activityId: string): boolean {
  const row = db()
    .prepare(
      "SELECT 1 FROM lesson_plan_activities WHERE plan_id = ? AND activity_id = ?",
    )
    .get(planId, activityId);
  return Boolean(row);
}

export function addActivityToPlan(planId: string, activityId: string) {
  if (isActivityInPlan(planId, activityId)) return;
  const { maxPos } = db()
    .prepare(
      "SELECT COALESCE(MAX(position), -1) as maxPos FROM lesson_plan_activities WHERE plan_id = ?",
    )
    .get(planId) as { maxPos: number };
  db()
    .prepare(
      "INSERT INTO lesson_plan_activities (plan_id, activity_id, position) VALUES (?, ?, ?)",
    )
    .run(planId, activityId, maxPos + 1);
}

export function removeActivityFromPlan(planId: string, activityId: string) {
  db()
    .prepare("DELETE FROM lesson_plan_activities WHERE plan_id = ? AND activity_id = ?")
    .run(planId, activityId);
}

export function renamePlan(planId: string, title: string) {
  db().prepare("UPDATE lesson_plans SET title = ? WHERE id = ?").run(title.trim() || "Meu plano de aula", planId);
}
