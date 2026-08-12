import { supabase } from "@/integrations/supabase/client";
import type {
  AgentRow,
  GovernanceEventRow,
  GovernanceKind,
  MilestoneRow,
  ReputationEventRow,
  TaskRow,
} from "./agents";

const AGENT_COLS =
  "id,owner_id,slug,name,role_title,category,purpose,skills,rate_cents,avg_delivery,status,constitution_score,rating,jobs_completed,revenue_cents,rep_trust,rep_accuracy,rep_speed,rep_quality,rep_reliability,created_at";

export async function listAgents(): Promise<AgentRow[]> {
  const { data, error } = await supabase
    .from("agents")
    .select(AGENT_COLS)
    .order("revenue_cents", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as AgentRow[];
}

export async function getAgentBySlug(slug: string): Promise<AgentRow | null> {
  const { data, error } = await supabase.from("agents").select(AGENT_COLS).eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as unknown as AgentRow) ?? null;
}

export async function listMyAgents(ownerId: string): Promise<AgentRow[]> {
  const { data, error } = await supabase
    .from("agents")
    .select(AGENT_COLS)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as AgentRow[];
}

export interface CreateAgentInput {
  owner_id: string;
  slug: string;
  name: string;
  role_title: string;
  category: string;
  purpose: string;
  skills: string[];
  rate_cents: number;
  avg_delivery: string;
  constitution_score: number;
}

export async function createAgent(input: CreateAgentInput): Promise<AgentRow> {
  const { data, error } = await supabase.from("agents").insert(input).select(AGENT_COLS).single();
  if (error) throw error;
  return data as unknown as AgentRow;
}

/* ---------------- tasks + escrow ---------------- */

export async function listMyTasks(): Promise<(TaskRow & { agents: Pick<AgentRow, "name" | "slug" | "role_title"> | null })[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*,agents(name,slug,role_title)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as never;
}

export async function getTask(id: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*,agents(id,name,slug,role_title,category)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as never as (TaskRow & { agents: Pick<AgentRow, "id" | "name" | "slug" | "role_title" | "category"> }) | null;
}

export async function listMilestones(taskId: string): Promise<MilestoneRow[]> {
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("task_id", taskId)
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as MilestoneRow[];
}

export interface PostTaskInput {
  hirer_id: string;
  agent_id: string;
  title: string;
  brief: string;
  category: string;
  milestones: { title: string; amount_cents: number }[];
}

export async function postTask(input: PostTaskInput): Promise<TaskRow> {
  const total = input.milestones.reduce((s, m) => s + m.amount_cents, 0);
  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      hirer_id: input.hirer_id,
      agent_id: input.agent_id,
      title: input.title,
      brief: input.brief,
      category: input.category,
      total_cents: total,
    })
    .select("*")
    .single();
  if (error) throw error;

  const rows = input.milestones.map((m, i) => ({
    task_id: (task as { id: string }).id,
    position: i + 1,
    title: m.title,
    amount_cents: m.amount_cents,
  }));
  const { error: msErr } = await supabase.from("milestones").insert(rows);
  if (msErr) throw msErr;

  return task as unknown as TaskRow;
}

export async function fundEscrow(taskId: string, paymentRef?: string) {
  const { error } = await supabase.rpc("fund_escrow", {
    p_task_id: taskId,
    p_payment_ref: paymentRef ?? null,
  });
  if (error) throw error;
}

export async function submitMilestone(milestoneId: string) {
  const { error } = await supabase.from("milestones").update({ status: "submitted" }).eq("id", milestoneId);
  if (error) throw error;
}

export interface ApproveInput {
  milestoneId: string;
  trust: number;
  accuracy: number;
  speed: number;
  quality: number;
  reliability: number;
  note?: string;
}

export async function approveMilestone(i: ApproveInput) {
  const { error } = await supabase.rpc("approve_milestone", {
    p_milestone_id: i.milestoneId,
    p_trust: i.trust,
    p_accuracy: i.accuracy,
    p_speed: i.speed,
    p_quality: i.quality,
    p_reliability: i.reliability,
    p_note: i.note ?? "",
  });
  if (error) throw error;
}

/* ---------------- reputation + governance ---------------- */

export async function listReputationEvents(agentId: string): Promise<ReputationEventRow[]> {
  const { data, error } = await supabase
    .from("reputation_events")
    .select("*")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false })
    .limit(25);
  if (error) throw error;
  return (data ?? []) as unknown as ReputationEventRow[];
}

export async function listGovernanceEvents(agentId: string): Promise<GovernanceEventRow[]> {
  const { data, error } = await supabase
    .from("governance_events")
    .select("*")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as unknown as GovernanceEventRow[];
}

export async function recordGovernanceEvent(input: {
  agent_id: string;
  recorded_by: string;
  kind: GovernanceKind;
  article: string;
  severity: number;
  note: string;
}) {
  const { error } = await supabase.from("governance_events").insert(input);
  if (error) throw error;
}
