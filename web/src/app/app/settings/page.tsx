import { fetchMe } from "@/lib/api";
import { SettingsContent } from "./SettingsContent";

export default async function SettingsPage() {
  let me: { preferences?: Record<string, unknown> } = {
    preferences: {},
  };
  try {
    me = await fetchMe();
  } catch {
    // If fetch fails (e.g. API down), render with defaults
  }

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <SettingsContent initialMe={me} />
    </section>
  );
}
