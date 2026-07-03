"use client";

import { useEffect } from "react";
import { WORKFLOW_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function WorkflowStepper({ status }: { status: string }) {
  const currentIndex = WORKFLOW_STEPS.findIndex((step) =>
    (step.statuses as readonly string[]).includes(status)
  );

  return (
    <ol className="space-y-2">
      {WORKFLOW_STEPS.map((step, i) => {
        const isActive = i === currentIndex;
        const isDone = currentIndex > i;
        return (
          <li key={step.key} className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                isDone && "bg-emerald-500 text-white",
                isActive && "bg-emerald-700 text-white ring-2 ring-emerald-200",
                !isDone && !isActive && "bg-slate-100 text-slate-500"
              )}
            >
              {isDone ? "✓" : i + 1}
            </span>
            <span
              className={cn(
                isActive && "font-semibold text-emerald-800",
                isDone && "text-emerald-700",
                !isDone && !isActive && "text-slate-500"
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function MarkAsRead({ id }: { id: number }) {
  useEffect(() => {
    fetch(`/api/memorandum/${id}/read`, { method: "POST" }).catch(() => {});
  }, [id]);
  return null;
}
