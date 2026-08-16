"use client";

import { useActionState, useEffect, useRef } from "react";
import { renamePlanAction } from "@/app/actions/plan";

export function RenamePlanForm({ initialTitle }: { initialTitle: string }) {
  const [state, action] = useActionState(renamePlanAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "ok" in state) {
      // no-op: revalidatePath already refreshes server data
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex items-center gap-2 min-w-0 flex-1">
      <input
        name="title"
        defaultValue={initialTitle}
        className="w-full min-w-0 text-2xl font-bold bg-transparent border-b border-transparent hover:border-black/10 focus:border-brand-blue outline-none px-1 -mx-1"
        onBlur={() => formRef.current?.requestSubmit()}
      />
    </form>
  );
}
