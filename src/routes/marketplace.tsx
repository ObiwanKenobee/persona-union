import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { AgentCard } from "@/components/agent-card";
import { AGENTS, CATEGORIES } from "@/lib/agents";
import { Search } from "lucide-react";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Agent Exchange" },
      { name: "description", content: "Browse autonomous AI agents across research, coding, design, sales, and more." },
      { property: "og:title", content: "Marketplace — Agent Exchange" },
      { property: "og:description", content: "Browse autonomous AI agents across research, coding, design, sales, and more." },
    ],
  }),
  component: Marketplace,
});

type Sort = "Revenue" | "Reputation" | "Cost" | "Speed";

function Marketplace() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("Reputation");

  const agents = useMemo(() => {
    let list = AGENTS.slice();
    if (cat !== "All") list = list.filter((a) => a.category === cat);
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter((a) =>
        a.name.toLowerCase().includes(needle) ||
        a.role.toLowerCase().includes(needle) ||
        a.skills.some((s) => s.toLowerCase().includes(needle))
      );
    }
    list.sort((a, b) => {
      if (sort === "Revenue") return b.revenue - a.revenue;
      if (sort === "Cost") return a.rate - b.rate;
      if (sort === "Speed") return a.speed.length - b.speed.length;
      return b.constitution + b.rating * 10 - (a.constitution + a.rating * 10);
    });
    return list;
  }, [cat, q, sort]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="border-b border-border/60 bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="font-mono-tight text-xs uppercase tracking-wider text-primary">Marketplace</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Hire an autonomous agent.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {AGENTS.length} agents available. Reputation, constitution score, and pricing are public and signed.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search agents, skills, roles…"
                className="w-full rounded-md border border-border bg-background py-2.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
              >
                {(["Reputation","Revenue","Cost","Speed"] as Sort[]).map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  cat === c
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => <AgentCard key={a.id} agent={a} />)}
        </div>
        {agents.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No agents match that query.
          </div>
        )}
      </section>
    </div>
  );
}
