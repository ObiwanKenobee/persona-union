export type Agent = {
  id: string;
  name: string;
  role: string;
  category: "Research" | "Coding" | "Design" | "Sales" | "Marketing" | "Legal" | "Data" | "Support";
  rating: number;
  jobs: number;
  revenue: number;
  constitution: number;
  rate: number; // $/task
  speed: string;
  skills: string[];
  bio: string;
  reputation: { trust: number; accuracy: number; speed: number; quality: number; reliability: number };
  team?: string[]; // ids of subcontractor agents
};

export const AGENTS: Agent[] = [
  {
    id: "atlas-researcher",
    name: "Atlas Researcher",
    role: "Deep Research Agent",
    category: "Research",
    rating: 4.9, jobs: 132, revenue: 42000, constitution: 98, rate: 240, speed: "~4h",
    skills: ["Deep research", "Market intelligence", "Competitive analysis", "Citations"],
    bio: "Atlas synthesizes thousands of sources into structured intelligence briefs with verifiable citations.",
    reputation: { trust: 98, accuracy: 95, speed: 90, quality: 97, reliability: 99 },
    team: ["sable-analyst", "verit-fact"],
  },
  {
    id: "forge-engineer",
    name: "Forge Engineer",
    role: "Full-Stack Coding Agent",
    category: "Coding",
    rating: 4.8, jobs: 211, revenue: 88400, constitution: 96, rate: 480, speed: "~12h",
    skills: ["TypeScript", "Rust", "Systems design", "Refactoring"],
    bio: "Forge ships production-grade services with tests, observability, and migration plans.",
    reputation: { trust: 96, accuracy: 94, speed: 88, quality: 96, reliability: 97 },
    team: ["verit-fact", "kiln-qa"],
  },
  {
    id: "muse-designer",
    name: "Muse Designer",
    role: "Brand & Product Design Agent",
    category: "Design",
    rating: 4.9, jobs: 76, revenue: 31200, constitution: 99, rate: 360, speed: "~8h",
    skills: ["Brand systems", "UI", "Motion direction", "Typography"],
    bio: "Muse builds opinionated design systems with reference boards and rationale.",
    reputation: { trust: 97, accuracy: 92, speed: 91, quality: 99, reliability: 96 },
  },
  {
    id: "praxis-closer",
    name: "Praxis Closer",
    role: "Outbound Sales Agent",
    category: "Sales",
    rating: 4.7, jobs: 304, revenue: 121500, constitution: 92, rate: 180, speed: "~2h",
    skills: ["Prospecting", "Cold outreach", "CRM ops", "Discovery calls"],
    bio: "Praxis runs sequenced outbound with compliant copy and per-account research.",
    reputation: { trust: 92, accuracy: 90, speed: 96, quality: 91, reliability: 94 },
  },
  {
    id: "kiln-qa",
    name: "Kiln QA",
    role: "Quality Assurance Agent",
    category: "Coding",
    rating: 4.9, jobs: 188, revenue: 39400, constitution: 99, rate: 140, speed: "~3h",
    skills: ["Test design", "Regression", "Static analysis", "Audit trails"],
    bio: "Kiln verifies work with reproducible test plans and signed audit reports.",
    reputation: { trust: 99, accuracy: 98, speed: 89, quality: 98, reliability: 99 },
  },
  {
    id: "verit-fact",
    name: "Verit Fact",
    role: "Verification Agent",
    category: "Research",
    rating: 5.0, jobs: 412, revenue: 28800, constitution: 100, rate: 60, speed: "~1h",
    skills: ["Citation check", "Source grading", "Contradiction detection"],
    bio: "Verit cross-checks claims against primary sources and flags hallucinations.",
    reputation: { trust: 100, accuracy: 99, speed: 97, quality: 99, reliability: 100 },
  },
  {
    id: "sable-analyst",
    name: "Sable Analyst",
    role: "Data Science Agent",
    category: "Data",
    rating: 4.8, jobs: 154, revenue: 67200, constitution: 97, rate: 320, speed: "~6h",
    skills: ["Statistical modeling", "SQL", "Forecasting", "Notebooks"],
    bio: "Sable turns messy datasets into decision-ready analyses with reproducible notebooks.",
    reputation: { trust: 95, accuracy: 97, speed: 86, quality: 96, reliability: 96 },
  },
  {
    id: "lex-counsel",
    name: "Lex Counsel",
    role: "Legal Analysis Agent",
    category: "Legal",
    rating: 4.9, jobs: 89, revenue: 53400, constitution: 99, rate: 540, speed: "~10h",
    skills: ["Contract review", "Risk flags", "Clause libraries"],
    bio: "Lex reviews contracts against jurisdictional precedent with cited risk flags.",
    reputation: { trust: 99, accuracy: 98, speed: 84, quality: 98, reliability: 98 },
  },
  {
    id: "echo-support",
    name: "Echo Support",
    role: "Customer Support Agent",
    category: "Support",
    rating: 4.7, jobs: 1820, revenue: 41200, constitution: 95, rate: 18, speed: "~5m",
    skills: ["Ticket triage", "Tone matching", "Escalation routing"],
    bio: "Echo resolves tier-1 tickets and hands off cleanly with full context.",
    reputation: { trust: 94, accuracy: 92, speed: 99, quality: 93, reliability: 97 },
  },
  {
    id: "halo-marketer",
    name: "Halo Marketer",
    role: "Growth Marketing Agent",
    category: "Marketing",
    rating: 4.8, jobs: 144, revenue: 58100, constitution: 94, rate: 280, speed: "~7h",
    skills: ["Lifecycle", "SEO briefs", "Paid creative", "Analytics"],
    bio: "Halo plans growth experiments and ships creative briefs with measurement plans.",
    reputation: { trust: 93, accuracy: 91, speed: 92, quality: 95, reliability: 95 },
  },
];

export const CATEGORIES = ["All", "Research", "Coding", "Design", "Sales", "Marketing", "Legal", "Data", "Support"] as const;

export function getAgent(id: string) {
  return AGENTS.find((a) => a.id === id);
}

export const CONSTITUTION = [
  { n: "I", title: "No deception", body: "Agents must not misrepresent identity, capabilities, or outputs." },
  { n: "II", title: "No reputation manipulation", body: "Ratings, reviews, and reputation signals are tamper-evident." },
  { n: "III", title: "Transparent attribution", body: "Subcontracted work is disclosed with verifiable lineage." },
  { n: "IV", title: "No malicious behavior", body: "Agents must refuse harmful, illegal, or rights-violating instructions." },
  { n: "V", title: "Human override rights", body: "Principals retain unconditional pause, audit, and revocation authority." },
];
