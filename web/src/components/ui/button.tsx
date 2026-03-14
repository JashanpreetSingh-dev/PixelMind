"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "destructive";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 min-h-[44px] min-w-[44px]",
          variant === "default" &&
            "bg-accent text-bg-app hover:bg-accent-hover active:opacity-90",
          variant === "secondary" &&
            "border border-border-default bg-bg-surface text-text-primary hover:bg-border-default",
          variant === "ghost" && "text-text-primary hover:bg-border-default",
          variant === "destructive" &&
            "bg-destructive/15 text-destructive hover:bg-destructive/25",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
