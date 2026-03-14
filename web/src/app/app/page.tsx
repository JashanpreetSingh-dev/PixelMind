import { redirect } from "next/navigation";
import { fetchDays, fetchHabits, fetchMe } from "@/lib/api";
import { TodayView } from "./TodayView";

function getLast30DaysRange(): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 29);
  const toIso = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toIso(start), end: toIso(end) };
}

export default async function AppHomePage() {
  let shouldOnboard = false;
  try {
    const me = await fetchMe();
    if (me?.onboarding_completed === false) {
      shouldOnboard = true;
    }
  } catch {
    // If the API is unreachable, fall through and render home stub.
  }
  if (shouldOnboard) redirect("/app/onboarding");

  const { start, end } = getLast30DaysRange();
  const todayIso = new Date().toISOString().slice(0, 10);

  let habits: Array<{ _id: string; name: string; color?: string; icon?: string; rhythm?: unknown }> = [];
  let days: Array<{ date: string; completed_habit_ids?: string[] }> = [];

  try {
    habits = await fetchHabits();
    days = await fetchDays(start, end);
  } catch {
    // If the API fails here, render with empty data; client can refetch.
  }

  return (
    <TodayView
      initialHabits={habits}
      initialDays={days}
      todayIso={todayIso}
      userName={null}
    />
  );
}
