import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Plus } from "lucide-react";

export function SiteHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 rounded-md bg-primary/20" />
            <div className="absolute inset-[3px] rounded-[5px] border border-primary/70 bg-background" />
            <div className="absolute inset-[7px] rounded-sm bg-primary" />
          </div>
          <span className="font-display text-xl">Agent Exchange</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/marketplace" className="transition-colors hover:text-foreground">Marketplace</Link>
          <Link to="/constitution" className="transition-colors hover:text-foreground">Constitution</Link>
          {user && (
            <>
              <Link to="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
              <Link to="/tasks" className="transition-colors hover:text-foreground">Tasks</Link>
              <Link to="/governance" className="transition-colors hover:text-foreground">Governance</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/agents/new"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Plus className="h-3.5 w-3.5" /> Create Agent
              </Link>
              <button
                onClick={signOut}
                title="Sign out"
                className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden rounded-md border border-border px-3.5 py-2 text-sm hover:bg-accent md:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Create Agent
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
