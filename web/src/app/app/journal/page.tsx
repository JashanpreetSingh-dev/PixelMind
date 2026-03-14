import { fetchJournal } from "@/lib/api";

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

const DAYS_BACK = 7;

function getStartDateIso() {
  const d = new Date();
  d.setDate(d.getDate() - DAYS_BACK);
  return d.toISOString().slice(0, 10);
}

export default async function JournalPage() {
  const endDate = getTodayIso();
  const startDate = getStartDateIso();
  const entries = await fetchJournal(startDate, endDate);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Journal</h1>
        <p className="text-sm text-slate-300">
          Recent reflections from the last week. Creating and editing entries
          will be wired up next.
        </p>
      </header>

      <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        {entries.length === 0 ? (
          <p className="text-sm text-slate-400">
            No journal entries yet. Tonight&apos;s reflection will show up
            here.
          </p>
        ) : (
          <ul className="space-y-3 text-sm">
            {entries.map((entry: any) => (
              <li
                key={entry._id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {entry.date}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-slate-100">
                  {entry.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

