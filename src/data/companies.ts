// src/data/companies.ts

export type ESGMetric = {
  score: number;
  gap: number; // The difference between marketing and reality
  flags: string[]; // Specific issues (e.g., "Child Labor", "Oil Spill")
};

export type Company = {
  id: string;
  name: string;
  ticker: string;
  industry: "Energy" | "Tech" | "Pharma" | "Finance" | "Defense";
  marketingScore: number; // The "Public Relations" score
  auditScore: number;     // The "Axiom" calculated score
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  metrics: {
    environment: ESGMetric;
    social: ESGMetric;
    governance: ESGMetric;
  };
  scandalTimeline: { year: number; event: string; impact: number }[];
};

export const heroCompanies: Company[] = [
  {
    id: "c-001",
    name: "PetroCore Systems",
    ticker: "PCS",
    industry: "Energy",
    marketingScore: 92,
    auditScore: 45,
    riskLevel: "Critical",
    metrics: {
      environment: { score: 30, gap: -55, flags: ["Undisclosed Methane Leaks", "Protected Land Violation"] },
      social: { score: 60, gap: -20, flags: ["Union Busting"] },
      governance: { score: 45, gap: -40, flags: ["Board Corruption", "Lobbying Spend"] },
    },
    scandalTimeline: [
      { year: 2022, event: "Offshore Rig Failure", impact: -15 },
      { year: 2024, event: "Executive Embezzlement", impact: -25 },
    ],
  },
  {
    id: "c-002",
    name: "Aegis Defense",
    ticker: "AGS",
    industry: "Defense",
    marketingScore: 78,
    auditScore: 75, // Honest but controversial
    riskLevel: "Medium",
    metrics: {
      environment: { score: 65, gap: -5, flags: ["Heavy Metal Waste"] },
      social: { score: 80, gap: 5, flags: [] },
      governance: { score: 80, gap: 0, flags: ["Government Contracts"] },
    },
    scandalTimeline: [],
  },
  {
    id: "c-003",
    name: "Veridian Health",
    ticker: "VRD",
    industry: "Pharma",
    marketingScore: 98,
    auditScore: 88,
    riskLevel: "Low",
    metrics: {
      environment: { score: 90, gap: -5, flags: [] },
      social: { score: 85, gap: -10, flags: ["Pricing Monopoly"] },
      governance: { score: 89, gap: -2, flags: [] },
    },
    scandalTimeline: [{ year: 2021, event: "Patent Lawsuit", impact: -5 }],
  },
];

// Helper to simulate a larger database
export const getAllCompanies = () => {
  // In a real app, we would generate 50 more random ones here
  return heroCompanies;
};