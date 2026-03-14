"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/app", label: "Home", Icon: LayoutDashboard },
  { href: "/app/journal", label: "Journal", Icon: BookOpen },
  { href: "/app/insights", label: "Insights", Icon: Sparkles },
  { href: "/app/settings", label: "Settings", Icon: SlidersHorizontal },
];

const ICON_SIZE = 22;
const ICON_STROKE = 1.5;
const ICON_STROKE_ACTIVE = 2;

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
            className={cn(
              "flex min-h-[44px] min-w-[44px] flex-1 items-center justify-center transition hover:bg-border-default",
              isActive ? "text-today-accent" : "text-text-muted"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center transition-transform duration-200",
                isActive && "scale-110"
              )}
            >
              <Icon
                size={ICON_SIZE}
                strokeWidth={isActive ? ICON_STROKE_ACTIVE : ICON_STROKE}
                aria-hidden
              />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
