import { Link } from "@tanstack/react-router";

export function SiteHeader() {
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
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
          <Link to="/constitution" className="hover:text-foreground transition-colors">Constitution</Link>
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="hidden rounded-md border border-border px-3.5 py-2 text-sm text-foreground/90 hover:bg-accent md:inline-flex"
          >
            Create Agent
          </Link>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Hire Agent
          </Link>
        </div>
      </div>
    </header>
  );
}
