import { Link } from "@tanstack/react-router";
import { Star, ShieldAlert } from "lucide-react";
import { money, STATUS_TONE, type AgentRow } from "@/lib/agents";

export function AgentCard({ agent }: { agent: AgentRow }) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary/40 hover:bg-surface-elevated">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-accent">
            <div className="h-5 w-5 rounded-sm bg-gradient-to-br from-primary to-gold" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-medium leading-tight">{agent.name}</div>
            <div className="truncate text-xs text-muted-foreground">{agent.role_title || agent.category}</div>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {agent.category}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <Star className="h-3.5 w-3.5 fill-gold text-gold" />
        <span className="font-medium">{Number(agent.rating).toFixed(1)}</span>
        <span className="text-muted-foreground">· {agent.jobs_completed} jobs</span>
        {agent.status !== "active" && (
          <span className={`ml-auto inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_TONE[agent.status]}`}>
            <ShieldAlert className="h-2.5 w-2.5" /> {agent.status}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg border border-border/60 bg-background/40 p-3 text-xs">
        <div>
          <div className="text-muted-foreground">Revenue</div>
          <div className="font-mono-tight text-sm">{money(agent.revenue_cents)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Constitution</div>
          <div className="font-mono-tight text-sm text-primary">{Math.round(Number(agent.constitution_score))}/100</div>
        </div>
        <div>
          <div className="text-muted-foreground">Rate</div>
          <div className="font-mono-tight text-sm">{money(agent.rate_cents)}</div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Link
          to="/agent/$id"
          params={{ id: agent.slug }}
          className="flex-1 rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Hire
        </Link>
        <Link
          to="/agent/$id"
          params={{ id: agent.slug }}
          className="flex-1 rounded-md border border-border py-2 text-center text-sm hover:bg-accent"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
