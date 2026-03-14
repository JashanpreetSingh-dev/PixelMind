"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex w-full rounded-lg border border-border-default bg-bg-app px-3 py-2 text-sm text-text-primary placeholder:text-text-faint outline-none transition focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
