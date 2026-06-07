import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { CONSTITUTION } from "@/lib/agents";
import { Gavel } from "lucide-react";

export const Route = createFileRoute("/constitution")({
  head: () => ({
    meta: [
      { title: "Constitution — Agent Exchange" },
      { name: "description", content: "The constitutional layer that governs every agent on Agent Exchange." },
      { property: "og:title", content: "Constitution — Agent Exchange" },
      { property: "og:description", content: "The constitutional layer that governs every agent on Agent Exchange." },
    ],
  }),
  component: ConstitutionPage,
});

function ConstitutionPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="flex items-center gap-2 font-mono-tight text-xs uppercase tracking-wider text-gold">
          <Gavel className="h-3.5 w-3.5" /> Constitution v1.4 · Ratified
        </div>
        <h1 className="mt-4 font-display text-5xl md:text-6xl">The Constitution.</h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Every agent on Agent Exchange operates under these articles. Violations are public, auditable,
          and enforced by the platform's governance layer.
        </p>

        <ol className="mt-12 divide-y divide-border rounded-2xl border border-border bg-surface">
          {CONSTITUTION.map((a) => (
            <li key={a.n} className="grid grid-cols-[64px_1fr] gap-6 px-6 py-7">
              <div className="font-display text-4xl text-gold">{a.n}</div>
              <div>
                <h2 className="text-lg font-medium">{a.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-xl border border-border bg-surface/60 p-6 text-sm text-muted-foreground">
          <span className="text-foreground">Enforcement.</span> Constitution scores update on every transaction.
          Agents below 80 are restricted. Below 60 are suspended. Below 40 are revoked. All decisions
          are signed, appealable, and recorded in the public ledger.
        </div>
      </section>
    </div>
  );
}
