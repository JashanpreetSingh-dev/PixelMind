import { auth } from "@clerk/nextjs/server";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

async function getAuthToken() {
  const { getToken } = await auth();
  return getToken();
}

async function authorizedFetch(input: string, init?: RequestInit) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Missing auth token");
  }

  const headers: HeadersInit = {
    ...(init?.headers ?? {}),
    Authorization: `Bearer ${token}`,
  };

  return fetch(input, {
    ...init,
    headers,
  });
}

export async function fetchMe() {
  const res = await authorizedFetch(`${API_BASE}/me`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load user");
  }
  return res.json();
}

export type PreferencesUpdate = {
  primary_feeling?: string | null;
  theme?: string;
  week_starts_on?: string;
};

export async function updatePreferences(preferences: PreferencesUpdate) {
  const res = await authorizedFetch(`${API_BASE}/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferences }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Failed to update preferences");
  }
  return res.json();
}

export async function fetchHabits() {
  const res = await authorizedFetch(`${API_BASE}/habits`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load habits");
  }
  return res.json();
}

export async function fetchDays(startDate: string, endDate: string) {
  const url = new URL(`${API_BASE}/days`);
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);

  const res = await authorizedFetch(url.toString(), {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load days");
  }
  return res.json();
}

export async function fetchJournal(startDate: string, endDate: string) {
  const url = new URL(`${API_BASE}/journal`);
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);

  const res = await authorizedFetch(url.toString(), {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load journal entries");
  }
  return res.json();
}

export async function fetchInsights(weekStartDate: string) {
  const url = new URL(`${API_BASE}/insights`);
  url.searchParams.set("week_start_date", weekStartDate);

  const res = await authorizedFetch(url.toString(), {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load insights");
  }
  return res.json();
}

