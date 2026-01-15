// src/data/companies.ts
import rawData from './esg_data.json';

// --- TYPES ---
export type ESGMetric = {
  score: number;
  gap: number;
  flags: string[];
};

export type Company = {
  id: string;
  name: string;
  ticker: string;
  industry: string;
  marketingScore: number;
  auditScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  metrics: {
    environment: ESGMetric;
    social: ESGMetric;
    governance: ESGMetric;
  };
  boardMembers: string[];
  scandalTimeline: { year: number; event: string; impact: number }[];
};

// --- THE NETWORK (Shared Board Members) ---
const BOARD_ELITES = [
  "J. Sterling", "A. Vance", "E. Musk", "L. Page", "S. Altman",
  "C. Bailey", "R. Kincaid", "M. Zuckerberg", "P. Thiel", "S. Nadella",
  "G. Soros", "W. Buffett", "K. Griffin"
];

// --- HELPER: GUESS INDUSTRY FROM NAME ---
const guessIndustry = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("power") || n.includes("energy") || n.includes("solar") || n.includes("carbon") || n.includes("volt")) return "Energy";
  if (n.includes("capital") || n.includes("wealth") || n.includes("finance") || n.includes("ledger") || n.includes("bancorp")) return "Finance";
  if (n.includes("defense") || n.includes("tactical") || n.includes("shield") || n.includes("munitions") || n.includes("arms")) return "Defense";
  if (n.includes("tech") || n.includes("data") || n.includes("cyber") || n.includes("net") || n.includes("sys")) return "Tech";
  if (n.includes("bio") || n.includes("health") || n.includes("pharma") || n.includes("med")) return "Pharma";
  return "Consumer"; // Fallback
};

// --- THE HYDRATION LOGIC ---
export const getAllCompanies = (): Company[] => {
  return rawData.map((raw, index) => {

    // 1. Calculate the Real Score (Audit)
    const auditScore = Math.round((raw.env + raw.soc + raw.gov) / 3);

    // 2. Simulate "Greenwashing" (Marketing Score is always higher)
    // If the real score is low (e.g. 30), they lie more (+30 pts).
    // If the real score is high (e.g. 90), they lie less (+5 pts).
    const lieFactor = Math.floor((100 - auditScore) * 0.4);
    const marketingScore = Math.min(99, auditScore + lieFactor);

    // 3. Assign Board Members (Randomly pick 2 elites)
    // We use the index to ensure deterministic "randomness" (refreshing doesn't change it)
    const member1 = BOARD_ELITES[index % BOARD_ELITES.length];
    const member2 = BOARD_ELITES[(index + 3) % BOARD_ELITES.length];

    // 4. Determine Flags based on low scores
    const envFlags = raw.env < 50 ? ["High Emissions", "Waste Mismanagement"] : [];
    const socFlags = raw.soc < 50 ? ["Labor Disputes", "Workplace Safety"] : [];
    const govFlags = raw.gov < 50 ? ["Board Transparency", "Executive Pay"] : [];

    return {
      id: `c-${index}`,
      name: raw.name.trim(),
      ticker: raw.name.substring(0, 3).toUpperCase(),
      industry: guessIndustry(raw.name),
      marketingScore,
      auditScore,
      riskLevel: auditScore < 40 ? "Critical" : auditScore < 60 ? "High" : auditScore < 80 ? "Medium" : "Low",
      metrics: {
        environment: { score: raw.env, gap: raw.env - marketingScore, flags: envFlags },
        social: { score: raw.soc, gap: raw.soc - marketingScore, flags: socFlags },
        governance: { score: raw.gov, gap: raw.gov - marketingScore, flags: govFlags },
      },
      boardMembers: [member1, member2],
      scandalTimeline: [],
    };
  });
};

export const heroCompanies = getAllCompanies().slice(0, 5); // Just for fallbacks