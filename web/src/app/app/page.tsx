import { redirect } from "next/navigation";
import { fetchHabits, fetchMe } from "@/lib/api";
import { TodayView } from "./TodayView";

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

  // Server doesn't know the user's timezone. Pass placeholder for first paint;
  // TodayView syncs to browser's local date on mount and fetches days with client range.
  const todayIsoPlaceholder = new Date().toISOString().slice(0, 10);

  let habits: Array<{ _id: string; name: string; color?: string; icon?: string; rhythm?: unknown }> = [];
  try {
    habits = await fetchHabits();
  } catch {
    // Client will refetch.
  }

  return (
    <TodayView
      initialHabits={habits}
      initialDays={[]}
      todayIso={todayIsoPlaceholder}
      userName={null}
    />
  );
}
