"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

export function SheetTrigger({
  asChild,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Trigger>) {
  return (
    <Dialog.Trigger asChild className={cn(className)} {...props}>
      {children}
    </Dialog.Trigger>
  );
}

export function SheetContent({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & React.ComponentProps<
  typeof Dialog.Content
>) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
      <Dialog.Content
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 flex max-h-[90vh] flex-col rounded-t-2xl border border-border-default bg-bg-surface text-text-primary shadow-lg transition-transform duration-200 ease-out data-[state=closed]:translate-y-full data-[state=open]:translate-y-0",
          className
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function SheetHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-1.5 p-4", className)}>{children}</div>;
}

export function SheetTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Dialog.Title className={cn("text-lg font-semibold", className)}>
      {children}
    </Dialog.Title>
  );
}

export function SheetClose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Dialog.Close asChild className={cn(className)}>
      {children}
    </Dialog.Close>
  );
}
