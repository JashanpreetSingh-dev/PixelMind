"use client";

import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { HelpCircle, Download, Smartphone } from "lucide-react";
import { useInstallPrompt } from "@/lib/install-prompt";
import { setThemeInDocument } from "../ThemeSync";
import { updateUserPreferences } from "./actions";

const FEELINGS = ["Calm", "Energized", "Proud", "Grounded", "Clear-headed"];
const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;
const WEEK_STARTS = [
  { value: "monday", label: "Monday" },
  { value: "sunday", label: "Sunday" },
] as const;

type Me = {
  preferences?: {
    primary_feeling?: string | null;
    theme?: string;
    week_starts_on?: string;
  };
};

type SettingsContentProps = {
  initialMe: Me;
};

export function SettingsContent({ initialMe }: SettingsContentProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [me, setMe] = useState<Me>(initialMe);
  const [openPicker, setOpenPicker] = useState<"feeling" | "theme" | "week" | "help" | null>(null);
  const [updating, setUpdating] = useState(false);
  const [installing, setInstalling] = useState(false);
  const { canInstall, isIOS, promptInstall } = useInstallPrompt();

  const prefs = me.preferences ?? {};
  const primaryFeeling = prefs.primary_feeling ?? null;
  const theme = prefs.theme ?? "system";
  const weekStartsOn = prefs.week_starts_on ?? "monday";

  async function handleUpdate(
    updates: { primary_feeling?: string | null; theme?: string; week_starts_on?: string }
  ) {
    setUpdating(true);
    setOpenPicker(null);
    try {
      const updated = await updateUserPreferences(updates);
      setMe((prev) => ({ ...prev, preferences: updated?.preferences ?? prev.preferences }));
      if (updates.theme !== undefined) {
        setThemeInDocument(updates.theme);
      }
    } catch {
      // Keep previous state on error
    } finally {
      setUpdating(false);
    }
  }

  async function handleSignOut() {
    await signOut({ redirectUrl: "/" });
    router.push("/");
  }

  const displayName =
    user?.firstName || user?.lastName
      ? [user.firstName, user.lastName].filter(Boolean).join(" ")
      : user?.primaryEmailAddress?.emailAddress ?? "Signed in";

  return (
    <div className="flex flex-col gap-6">
      {/* Account – tap to open Clerk profile / sign out */}
      <div className="rounded-xl border border-border-default bg-bg-surface p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-faint">
          Account
        </h2>
        <div className="flex min-h-[52px] items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-12 w-12 ring-0",
                  rootBox: "flex",
                },
              }}
            />
            <div className="min-w-0">
              <p className="truncate font-medium text-text-primary">{displayName}</p>
              <p className="text-xs text-text-muted">Tap to manage account & sign out</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences block */}
      <div className="rounded-xl border border-border-default bg-bg-surface p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-faint">
          Preferences
        </h2>
        <div className="flex flex-col gap-0">
          {/* Primary feeling */}
          <div className="min-h-[44px] border-b border-border-default last:border-b-0">
            <button
              type="button"
              onClick={() =>
                setOpenPicker((p) => (p === "feeling" ? null : "feeling"))
              }
              className="flex w-full items-center justify-between py-3 text-left text-sm"
              aria-expanded={openPicker === "feeling"}
            >
              <span className="text-text-primary">Primary feeling</span>
              <span className="text-text-muted">
                {primaryFeeling ?? "Not set"}
              </span>
            </button>
            {openPicker === "feeling" && (
              <div className="flex flex-wrap gap-2 pb-3">
                {FEELINGS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    disabled={updating}
                    onClick={() =>
                      handleUpdate({ primary_feeling: label })
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      primaryFeeling === label
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-border-default bg-bg-app text-text-primary hover:border-border-default/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme */}
          <div className="min-h-[44px] border-b border-border-default last:border-b-0">
            <button
              type="button"
              onClick={() =>
                setOpenPicker((p) => (p === "theme" ? null : "theme"))
              }
              className="flex w-full items-center justify-between py-3 text-left text-sm"
              aria-expanded={openPicker === "theme"}
            >
              <span className="text-text-primary">Theme</span>
              <span className="text-text-muted">
                {THEMES.find((t) => t.value === theme)?.label ?? "System"}
              </span>
            </button>
            {openPicker === "theme" && (
              <div className="flex flex-wrap gap-2 pb-3">
                {THEMES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    disabled={updating}
                    onClick={() => handleUpdate({ theme: value })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      theme === value
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-border-default bg-bg-app text-text-primary hover:border-border-default/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Week starts on */}
          <div className="min-h-[44px]">
            <button
              type="button"
              onClick={() =>
                setOpenPicker((p) => (p === "week" ? null : "week"))
              }
              className="flex w-full items-center justify-between py-3 text-left text-sm"
              aria-expanded={openPicker === "week"}
            >
              <span className="text-text-primary">Week starts on</span>
              <span className="text-text-muted">
                {WEEK_STARTS.find((w) => w.value === weekStartsOn)?.label ??
                  "Monday"}
              </span>
            </button>
            {openPicker === "week" && (
              <div className="flex flex-wrap gap-2 pb-3">
                {WEEK_STARTS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    disabled={updating}
                    onClick={() => handleUpdate({ week_starts_on: value })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      weekStartsOn === value
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-border-default bg-bg-app text-text-primary hover:border-border-default/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help – Install app */}
      <div className="rounded-xl border border-border-default bg-bg-surface p-4">
        <button
          type="button"
          onClick={() =>
            setOpenPicker((p) => (p === "help" ? null : "help"))
          }
          className="flex w-full items-center justify-between text-left"
          aria-expanded={openPicker === "help"}
        >
          <span className="flex items-center gap-2 text-sm text-text-primary">
            <HelpCircle className="h-4 w-4 text-text-muted" aria-hidden />
            Install app
          </span>
          <span className="text-xs text-text-muted">
            {openPicker === "help" ? "Hide" : "Show"}
          </span>
        </button>
        {openPicker === "help" && (
          <div className="mt-3 space-y-3">
            <button
              type="button"
              onClick={async () => {
                if (canInstall) {
                  setInstalling(true);
                  await promptInstall();
                  setInstalling(false);
                }
              }}
              disabled={installing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-today-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              <Download className="h-4 w-4 shrink-0" aria-hidden />
              {installing ? "Opening…" : isIOS ? "Install (see instructions below)" : "Install PixelMind"}
            </button>
            <div className="flex items-start gap-3 rounded-lg border border-border-default bg-bg-app p-3 text-sm">
              <Smartphone className="h-5 w-5 shrink-0 text-text-muted" aria-hidden />
              <div className="min-w-0 space-y-1 text-text-muted">
                <p className="font-medium text-text-primary">Add PixelMind to your home screen</p>
                {isIOS ? (
                  <p>In Safari: tap the Share button (square with arrow), then <strong>Add to Home Screen</strong>.</p>
                ) : canInstall ? (
                  <p>Tap <strong>Install PixelMind</strong> above, or use the browser menu (⋮) → <strong>Install app</strong>.</p>
                ) : (
                  <p>Use <strong>Install</strong> when the banner appears, or open the browser menu (⋮) and choose <strong>Install app</strong> / <strong>Add to Home screen</strong>.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sign out */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-border-default bg-bg-surface py-3 text-sm font-medium text-text-muted transition hover:bg-border-default hover:text-text-primary"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
