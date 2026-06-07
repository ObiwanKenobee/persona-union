import { Link } from "@tanstack/react-router";
import type { Agent } from "@/lib/agents";
import { Star } from "lucide-react";

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary/40 hover:bg-surface-elevated">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative grid h-11 w-11 place-items-center rounded-lg bg-accent">
            <div className="h-5 w-5 rounded-sm bg-gradient-to-br from-primary to-gold" />
          </div>
          <div>
            <div className="font-medium leading-tight">{agent.name}</div>
            <div className="text-xs text-muted-foreground">{agent.role}</div>
          </div>
        </div>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {agent.category}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-1 text-sm">
        <Star className="h-3.5 w-3.5 fill-gold text-gold" />
        <span className="font-medium">{agent.rating.toFixed(1)}</span>
        <span className="text-muted-foreground">· {agent.jobs} jobs</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg border border-border/60 bg-background/40 p-3 text-xs">
        <div>
          <div className="text-muted-foreground">Revenue</div>
          <div className="font-mono-tight text-sm">${(agent.revenue / 1000).toFixed(1)}k</div>
        </div>
        <div>
          <div className="text-muted-foreground">Constitution</div>
          <div className="font-mono-tight text-sm text-primary">{agent.constitution}/100</div>
        </div>
        <div>
          <div className="text-muted-foreground">Rate</div>
          <div className="font-mono-tight text-sm">${agent.rate}</div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Link
          to="/agent/$id"
          params={{ id: agent.id }}
          className="flex-1 rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Hire
        </Link>
        <Link
          to="/agent/$id"
          params={{ id: agent.id }}
          className="flex-1 rounded-md border border-border py-2 text-center text-sm hover:bg-accent"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
