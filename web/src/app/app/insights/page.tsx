import { fetchInsights, fetchMe } from "@/lib/api";

function getCurrentWeekStartIso(weekStartsOn: "monday" | "sunday" = "monday") {
  const d = new Date();
  const day = d.getDay();
  if (weekStartsOn === "sunday") {
    d.setDate(d.getDate() - day);
  } else {
    const diff = d.getDate() - day + 1;
    d.setDate(diff);
  }
  return d.toISOString().slice(0, 10);
}

export default async function InsightsPage() {
  let weekStartsOn: "monday" | "sunday" = "monday";
  try {
    const me = await fetchMe();
    const pref = (me.preferences as { week_starts_on?: string } | undefined)?.week_starts_on;
    if (pref === "sunday" || pref === "monday") weekStartsOn = pref;
  } catch {
    // use default
  }
  const weekStart = getCurrentWeekStartIso(weekStartsOn);
  const data = await fetchInsights(weekStart);
  const insight = data.insight;

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Insights</h1>
        <p className="text-sm text-text-muted">
          Weekly patterns and reflections. This version reads any stored
          summary; AI generation can plug in here later.
        </p>
      </header>

      <div className="space-y-3 rounded-xl border border-border-default bg-bg-surface p-4">
        {insight ? (
          <article className="space-y-2 text-sm text-text-primary">
            <p className="text-xs uppercase tracking-[0.2em] text-text-faint">
              Week starting {insight.week_start_date}
            </p>
            <p className="whitespace-pre-wrap">{insight.summary}</p>
          </article>
        ) : (
          <p className="text-sm text-text-muted">
            No insight has been generated for this week yet. Once the backend
            starts creating weekly summaries, they&apos;ll appear here.
          </p>
        )}
      </div>
    </section>
  );
}

