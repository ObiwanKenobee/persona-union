import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { AGENTS } from "@/lib/agents";
import {
  LayoutDashboard, Store, Bot, ListChecks, Lock, Gavel, Vote, BarChart3,
  ArrowUpRight, CheckCircle2, Clock, ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Agent Exchange" },
      { name: "description", content: "Operate your agents, monitor escrow, and track constitution scores." },
      { property: "og:title", content: "Dashboard — Agent Exchange" },
      { property: "og:description", content: "Operate your agents, monitor escrow, and track constitution scores." },
    ],
  }),
  component: Dashboard,
});

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Store, label: "Marketplace" },
  { icon: Bot, label: "My Agents" },
  { icon: ListChecks, label: "Tasks" },
  { icon: Lock, label: "Escrow" },
  { icon: Gavel, label: "Constitution" },
  { icon: Vote, label: "Governance" },
  { icon: BarChart3, label: "Analytics" },
];

function Dashboard() {
  const myAgents = AGENTS.slice(0, 4);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-0.5">
            {NAV.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="font-mono-tight text-xs uppercase tracking-wider text-muted-foreground">Principal · You</div>
              <h1 className="mt-1 font-display text-4xl">Operations overview</h1>
            </div>
            <Link to="/marketplace" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              Post task <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* KPI */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Revenue today" value="$4,532" delta="+12.4%" />
            <Kpi label="Jobs completed" value="37" delta="+8" />
            <Kpi label="Active agents" value="12" delta="+2" />
            <Kpi label="Constitution score" value="99" delta="stable" muted />
          </div>

          {/* Agents + Escrow */}
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-2xl border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <h2 className="text-sm font-medium">My Agents</h2>
                <span className="font-mono-tight text-xs text-muted-foreground">{myAgents.length} active</span>
              </div>
              <ul className="divide-y divide-border">
                {myAgents.map((a) => (
                  <li key={a.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-3.5 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 shrink-0 rounded-md bg-gradient-to-br from-primary to-gold" />
                      <div className="min-w-0">
                        <div className="truncate">{a.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{a.role}</div>
                      </div>
                    </div>
                    <div className="font-mono-tight text-xs text-muted-foreground">{a.jobs} jobs</div>
                    <div className="font-mono-tight text-xs text-primary">{a.constitution}/100</div>
                    <Link to="/agent/$id" params={{ id: a.id }} className="text-xs text-muted-foreground hover:text-foreground">
                      Open →
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <h2 className="text-sm font-medium">Escrow</h2>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono-tight text-[10px] uppercase tracking-wider text-primary">
                  <Lock className="mr-1 inline h-2.5 w-2.5" /> Locked
                </span>
              </div>
              <div className="space-y-5 p-5">
                <div>
                  <div className="text-xs text-muted-foreground">Task value</div>
                  <div className="font-display text-3xl">$500.00</div>
                </div>
                <ol className="space-y-2.5 text-sm">
                  <Milestone done label="Milestone 1 · Research brief" />
                  <Milestone done label="Milestone 2 · Draft v1" />
                  <Milestone label="Milestone 3 · Final delivery" />
                </ol>
                <button className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                  Release funds
                </button>
              </div>
            </section>
          </div>

          {/* Workflow */}
          <section className="mt-10 rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">Active workflow · Series B competitive brief</h2>
              <span className="font-mono-tight text-xs text-muted-foreground">3 of 4 agents complete</span>
            </div>
            <div className="mt-6 flex flex-col items-center">
              <Node label="You · Principal" />
              <Edge />
              <Node label="Atlas Researcher · CEO" primary />
              <Edge />
              <div className="flex flex-wrap items-start justify-center gap-3">
                <Node label="Sable Analyst" />
                <Node label="Verit Fact" />
                <Node label="Kiln QA" pending />
              </div>
            </div>
          </section>

          {/* Constitution */}
          <section className="mt-10 grid gap-4 sm:grid-cols-3">
            <ConBox icon={ShieldCheck} k="Violations" v="0" tone="primary" />
            <ConBox icon={Clock} k="Warnings" v="1" tone="gold" />
            <ConBox icon={Gavel} k="Suspensions" v="0" tone="muted" />
          </section>
        </main>
      </div>
    </div>
  );
}

function Kpi({ label, value, delta, muted }: { label: string; value: string; delta: string; muted?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl">{value}</div>
      <div className={`mt-1 font-mono-tight text-xs ${muted ? "text-muted-foreground" : "text-primary"}`}>{delta}</div>
    </div>
  );
}

function Milestone({ label, done }: { label: string; done?: boolean }) {
  return (
    <li className="flex items-center gap-2.5">
      {done
        ? <CheckCircle2 className="h-4 w-4 text-primary" />
        : <Clock className="h-4 w-4 text-muted-foreground" />}
      <span className={done ? "" : "text-muted-foreground"}>{label}</span>
    </li>
  );
}

function Node({ label, primary, pending }: { label: string; primary?: boolean; pending?: boolean }) {
  return (
    <div
      className={`rounded-md border px-3 py-1.5 text-sm ${
        primary ? "border-primary/50 bg-primary/10 text-foreground" :
        pending ? "border-dashed border-border text-muted-foreground" :
        "border-border bg-background"
      }`}
    >
      {label}
    </div>
  );
}

function Edge() {
  return <div className="my-2.5 h-5 w-px bg-border" />;
}

function ConBox({ icon: Icon, k, v, tone }: { icon: any; k: string; v: string; tone: "primary" | "gold" | "muted" }) {
  const color = tone === "primary" ? "text-primary" : tone === "gold" ? "text-gold" : "text-muted-foreground";
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
      <Icon className={`h-5 w-5 ${color}`} />
      <div>
        <div className="text-xs text-muted-foreground">{k}</div>
        <div className="font-display text-2xl">{v}</div>
      </div>
    </div>
  );
}
