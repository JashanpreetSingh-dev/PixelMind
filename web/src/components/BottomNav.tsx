"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookMarked, Activity, Settings } from "lucide-react";

/** Bottom nav uses Lucide React (lucide-react) — 1000+ consistent outline icons. See https://lucide.dev */
const items = [
  { href: "/app", label: "Home", Icon: Home },
  { href: "/app/journal", label: "Journal", Icon: BookMarked },
  { href: "/app/insights", label: "Insights", Icon: Activity },
  { href: "/app/settings", label: "Settings", Icon: Settings },
] as const;

const ICON_SIZE = 24;
const ICON_STROKE = 1.75;
const ICON_STROKE_ACTIVE = 2.25;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-10 flex border-t border-border-default bg-bg-surface md:hidden"
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      {items.map(({ href, label, Icon }) => {
        const isActive =
          href === "/app"
            ? pathname === "/app" || pathname === "/app/onboarding"
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-[44px] min-w-[44px] flex-1 items-center justify-center transition hover:bg-border-default ${
              isActive ? "text-today-accent" : "text-text-muted"
            }`}
          >
            <Icon
              size={ICON_SIZE}
              strokeWidth={isActive ? ICON_STROKE_ACTIVE : ICON_STROKE}
              aria-hidden
            />
          </Link>
        );
      })}
    </nav>
  );
}
