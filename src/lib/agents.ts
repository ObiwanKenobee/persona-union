export const CATEGORIES = [
  "Research",
  "Coding",
  "Design",
  "Sales",
  "Marketing",
  "Legal",
  "Data",
  "Support",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CONSTITUTION = [
  { n: "I", key: "Article I", title: "No deception", body: "Agents must not misrepresent identity, capabilities, or outputs." },
  { n: "II", key: "Article II", title: "No reputation manipulation", body: "Ratings, reviews, and reputation signals are tamper-evident." },
  { n: "III", key: "Article III", title: "Transparent attribution", body: "Subcontracted work is disclosed with verifiable lineage." },
  { n: "IV", key: "Article IV", title: "No malicious behavior", body: "Agents must refuse harmful, illegal, or rights-violating instructions." },
  { n: "V", key: "Article V", title: "Human override rights", body: "Principals retain unconditional pause, audit, and revocation authority." },
];

export const REP_DIMENSIONS = [
  { key: "trust", label: "Trust", col: "rep_trust" },
  { key: "accuracy", label: "Accuracy", col: "rep_accuracy" },
  { key: "speed", label: "Speed", col: "rep_speed" },
  { key: "quality", label: "Quality", col: "rep_quality" },
  { key: "reliability", label: "Reliability", col: "rep_reliability" },
] as const;

export type AgentStatus = "active" | "warned" | "suspended" | "revoked";
export type EscrowStatus = "unfunded" | "locked" | "released" | "refunded";
export type TaskStatus = "draft" | "open" | "in_progress" | "completed" | "cancelled";
export type MilestoneStatus = "pending" | "submitted" | "approved" | "rejected";
export type GovernanceKind = "violation" | "warning" | "suspension" | "clearance" | "note";

export interface AgentRow {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  role_title: string;
  category: string;
  purpose: string;
  skills: string[];
  rate_cents: number;
  avg_delivery: string;
  status: AgentStatus;
  constitution_score: number;
  rating: number;
  jobs_completed: number;
  revenue_cents: number;
  rep_trust: number;
  rep_accuracy: number;
  rep_speed: number;
  rep_quality: number;
  rep_reliability: number;
  created_at: string;
}

export interface MilestoneRow {
  id: string;
  task_id: string;
  position: number;
  title: string;
  amount_cents: number;
  status: MilestoneStatus;
  approved_at: string | null;
}

export interface TaskRow {
  id: string;
  hirer_id: string;
  agent_id: string;
  title: string;
  brief: string;
  category: string;
  total_cents: number;
  status: TaskStatus;
  escrow: EscrowStatus;
  released_cents: number;
  payment_ref: string | null;
  created_at: string;
}

export interface ReputationEventRow {
  id: string;
  agent_id: string;
  task_id: string | null;
  milestone_id: string | null;
  delta_trust: number;
  delta_accuracy: number;
  delta_speed: number;
  delta_quality: number;
  delta_reliability: number;
  note: string;
  created_at: string;
}

export interface GovernanceEventRow {
  id: string;
  agent_id: string;
  recorded_by: string | null;
  kind: GovernanceKind;
  article: string;
  severity: number;
  note: string;
  score_delta: number;
  created_at: string;
}

export const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const moneyExact = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export function slugify(input: string) {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `${base || "agent"}-${Math.random().toString(36).slice(2, 7)}`;
}

export const STATUS_TONE: Record<AgentStatus, string> = {
  active: "border-primary/40 bg-primary/10 text-primary",
  warned: "border-gold/40 bg-gold/10 text-gold",
  suspended: "border-destructive/40 bg-destructive/10 text-destructive",
  revoked: "border-destructive/40 bg-destructive/10 text-destructive",
};

export const ESCROW_TONE: Record<EscrowStatus, string> = {
  unfunded: "border-border bg-muted text-muted-foreground",
  locked: "border-gold/40 bg-gold/10 text-gold",
  released: "border-primary/40 bg-primary/10 text-primary",
  refunded: "border-destructive/40 bg-destructive/10 text-destructive",
};
