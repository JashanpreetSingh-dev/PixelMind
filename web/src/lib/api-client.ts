/**
 * Client-side API helpers. Use with getToken from useAuth() so requests are authenticated.
 */

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

export type GetToken = () => Promise<string | null>;

async function authFetch(
  getToken: GetToken,
  input: string,
  init?: RequestInit
): Promise<Response> {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");
  return fetch(input, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchHabitsClient(getToken: GetToken) {
  const res = await authFetch(getToken, `${API_BASE}/habits`);
  if (!res.ok) throw new Error("Failed to load habits");
  return res.json();
}

export async function fetchDaysClient(
  getToken: GetToken,
  startDate: string,
  endDate: string
) {
  const url = new URL(`${API_BASE}/days`);
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);
  const res = await authFetch(getToken, url.toString());
  if (!res.ok) throw new Error("Failed to load days");
  return res.json();
}

export async function upsertDayClient(
  getToken: GetToken,
  date: string,
  completed_habit_ids: string[],
  mood?: string
) {
  const res = await authFetch(getToken, `${API_BASE}/days`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, completed_habit_ids, mood }),
  });
  if (!res.ok) throw new Error("Failed to update day");
  return res.json();
}

export async function createHabitClient(
  getToken: GetToken,
  body: { name: string; color: string; icon?: string; rhythm?: Record<string, unknown> }
) {
  const res = await authFetch(getToken, `${API_BASE}/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Failed to create habit");
  }
  return res.json();
}

export async function updateHabitClient(
  getToken: GetToken,
  habitId: string,
  updates: { name?: string; color?: string; icon?: string; rhythm?: Record<string, unknown>; archived?: boolean }
) {
  const res = await authFetch(getToken, `${API_BASE}/habits/${habitId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update habit");
  return res.json();
}

export type JournalEntry = {
  _id?: string;
  date: string;
  mood?: string;
  prompt_id?: number;
  prompt_response?: string;
  free_text?: string;
  sealed?: boolean;
  text?: string;
};

export async function createJournalClient(
  getToken: GetToken,
  entry: {
    date: string;
    mood?: string;
    prompt_id?: number;
    prompt_response?: string;
    free_text?: string;
    sealed?: boolean;
  }
) {
  const res = await authFetch(getToken, `${API_BASE}/journal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error("Failed to create journal entry");
  return res.json() as Promise<JournalEntry>;
}

export async function fetchJournalTodayClient(
  getToken: GetToken,
  date: string
): Promise<JournalEntry | null> {
  const url = new URL(`${API_BASE}/journal/today`);
  url.searchParams.set("date", date);
  const res = await authFetch(getToken, url.toString());
  if (!res.ok) throw new Error("Failed to fetch today's journal entry");
  const data = await res.json();
  return data.entry ?? null;
}
