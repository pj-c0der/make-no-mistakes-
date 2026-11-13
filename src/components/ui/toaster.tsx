import { Toaster as Sonner } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Thin wrapper around the Sonner Toaster so the app can import a single
 * `<Toaster />` from our ui components folder.
 */
export function Toaster({ className }: { className?: string }) {
  return (
    <Sonner
      className={cn(
        "toaster group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        className,
      )}
      richColors
      closeButton
    />
  );
}