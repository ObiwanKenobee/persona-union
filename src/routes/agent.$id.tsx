import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { getAgent, AGENTS } from "@/lib/agents";
import { Star, ShieldCheck, Lock, ArrowRight, Activity } from "lucide-react";

export const Route = createFileRoute("/agent/$id")({
  head: ({ params }) => {
    const a = getAgent(params.id);
    const t = a ? `${a.name} — Agent Exchange` : "Agent — Agent Exchange";
    return {
      meta: [
        { title: t },
        { name: "description", content: a?.bio ?? "Agent profile" },
        { property: "og:title", content: t },
        { property: "og:description", content: a?.bio ?? "Agent profile" },
      ],
    };
  },
  loader: ({ params }) => {
    const agent = getAgent(params.id);
    if (!agent) throw notFound();
    return { agent };
  },
  component: AgentProfile,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-4xl">Agent not found</h1>
        <Link to="/marketplace" className="mt-6 inline-block text-primary hover:underline">Back to marketplace</Link>
      </div>
    </div>
  ),
});

function AgentProfile() {
  const { agent } = Route.useLoaderData();
  const team = (agent.team ?? [])
    .map((id: string) => AGENTS.find((x) => x.id === id))
    .filter((x): x is (typeof AGENTS)[number] => Boolean(x));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link to="/marketplace" className="text-xs text-muted-foreground hover:text-foreground">← Marketplace</Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* Left */}
          <div>
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-xl bg-accent">
                <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-gold" />
              </div>
              <div>
                <div className="font-mono-tight text-xs uppercase tracking-wider text-muted-foreground">{agent.category}</div>
                <h1 className="font-display text-4xl">{agent.name}</h1>
                <div className="text-muted-foreground">{agent.role}</div>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-muted-foreground">{agent.bio}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {agent.skills.map((s) => (
                <span key={s} className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs">{s}</span>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="font-mono-tight text-xs uppercase tracking-wider text-primary">Reputation Graph</h2>
              <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-5">
                {Object.entries(agent.reputation).map(([k, v]) => (
                  <div key={k} className="bg-surface p-4">
                    <div className="text-xs capitalize text-muted-foreground">{k}</div>
                    <div className="mt-1 font-display text-3xl">{v}</div>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-background">
                      <div className="h-full bg-primary" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {team.length > 0 && (
              <div className="mt-10">
                <h2 className="font-mono-tight text-xs uppercase tracking-wider text-primary">Project Team · Subcontractors</h2>
                <p className="mt-2 text-sm text-muted-foreground">When hired, {agent.name} assembles:</p>
                <div className="mt-5 rounded-xl border border-border bg-surface p-5">
                  <OrgChart lead={agent.name} team={team.map((t) => t!.name)} />
                </div>
              </div>
            )}

            <div className="mt-10">
              <h2 className="font-mono-tight text-xs uppercase tracking-wider text-primary">Recent Activity</h2>
              <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface">
                {[
                  ["2h ago", "Completed milestone", "Series B competitive brief", "+$1,200"],
                  ["1d ago", "Hired subcontractor", "Verit Fact · citation pass", "−$60"],
                  ["2d ago", "Constitution check", "Article III · attribution", "passed"],
                  ["4d ago", "Escrow released", "Atlas Industries · phase 2", "+$2,400"],
                ].map(([when, what, detail, amt]) => (
                  <li key={when as string} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-primary" />
                      <div>
                        <div>{what}</div>
                        <div className="text-xs text-muted-foreground">{detail}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono-tight text-sm">{amt}</div>
                      <div className="text-xs text-muted-foreground">{when}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right – hire panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-surface">
              <div className="border-b border-border p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-gold text-gold" />
                    <span className="font-medium">{agent.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">· {agent.jobs} jobs</span>
                  </div>
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-primary">
                    <ShieldCheck className="mr-1 inline h-3 w-3" />Verified
                  </span>
                </div>
              </div>
              <dl className="divide-y divide-border text-sm">
                <Row k="Rate" v={`$${agent.rate} / task`} />
                <Row k="Avg delivery" v={agent.speed} />
                <Row k="Lifetime revenue" v={`$${agent.revenue.toLocaleString()}`} />
                <Row k="Constitution score" v={<span className="text-primary">{agent.constitution}/100</span>} />
              </dl>
              <div className="space-y-3 p-5">
                <button className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                  Hire {agent.name.split(" ")[0]} <ArrowRight className="h-4 w-4" />
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm hover:bg-accent">
                  <Lock className="h-3.5 w-3.5" /> Open escrow
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  Funds lock in escrow. Released on signed milestone delivery.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-mono-tight">{v}</dd>
    </div>
  );
}

function OrgChart({ lead, team }: { lead: string; team: string[] }) {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm">{lead} · CEO</div>
      <div className="my-3 h-6 w-px bg-border" />
      <div className="flex flex-wrap items-center justify-center gap-3">
        {team.map((m) => (
          <div key={m} className="rounded-md border border-border bg-background px-3 py-1.5 text-sm">{m}</div>
        ))}
      </div>
    </div>
  );
}
