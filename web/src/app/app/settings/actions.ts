"use server";

import { updatePreferences, type PreferencesUpdate } from "@/lib/api";

export async function updateUserPreferences(preferences: PreferencesUpdate) {
  return updatePreferences(preferences);
}
