import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";

/**
 * Placeholder root layout for the ResiboWise PH scaffold (Task 1.1).
 *
 * The real shell is built in Task 4.1 and replaces this file. Until then this
 * component exists only so routing can be smoke-tested: it renders the
 * placeholder `/` route and the `*` not-found route via the router in
 * `main.tsx`.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container flex h-14 items-center justify-between">
          <a href="/" className="text-lg font-semibold tracking-tight">
            ResiboWise PH
          </a>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Placeholder scaffold</span>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <Outlet />
      </main>

      <Toaster />
    </div>
  );
}