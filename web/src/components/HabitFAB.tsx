"use client";

import { Plus } from "lucide-react";
import { useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { creationSheetOpenAtom } from "@/lib/atoms";
import { fetchHabitsClient } from "@/lib/api-client";

const MAX_HABITS = 10;

export function HabitFAB() {
  const { getToken } = useAuth();
  const pathname = usePathname();
  const setSheetOpen = useSetAtom(creationSheetOpenAtom);

  const { data: habits = [] } = useQuery({
    queryKey: ["habits"],
    queryFn: () => fetchHabitsClient(getToken),
  });

  if (pathname !== "/app") return null;
  if (habits.length >= MAX_HABITS) return null;

  return (
    <button
      type="button"
      aria-label="Add habit"
      onClick={() => setSheetOpen(true)}
      className="fixed right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-today-accent text-white shadow-lg transition hover:opacity-90 active:scale-95"
      style={{
        bottom: "calc(56px + max(1rem, env(safe-area-inset-bottom)))",
      }}
    >
      <Plus size={24} strokeWidth={2} />
    </button>
  );
}
