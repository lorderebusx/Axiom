"use client";

import { useState, useEffect } from "react";
import { Company } from "@/data/companies";
import clsx from "clsx";
import { Settings, RefreshCw } from "lucide-react";

type StressTestProps = {
  company: Company;
};

export default function StressTest({ company }: StressTestProps) {
  // State for our simulation sliders (0% to 100% pressure)
  const [regPressure, setRegPressure] = useState(0);
  const [laborPressure, setLaborPressure] = useState(0);
  
  // Calculated projected score
  const [projectedScore, setProjectedScore] = useState(company.auditScore);

  // The Logic Engine: Runs every time a slider moves
  useEffect(() => {
    // 1. Calculate penalty based on the company's "Hidden Gaps"
    // If they have a huge gap (bad behavior), pressure hurts them more.
    const envPenalty = (company.metrics.environment.gap * -1) * (regPressure / 100);
    const socPenalty = (company.metrics.social.gap * -1) * (laborPressure / 100);
    
    // 2. Only apply penalties if they are actually negative gaps (hidden risks)
    const totalPenalty = Math.max(0, envPenalty) + Math.max(0, socPenalty);
    
    // 3. Update the displayed score
    setProjectedScore(Math.round(company.auditScore - totalPenalty));
  }, [regPressure, laborPressure, company]);

  const scoreDrop = company.auditScore - projectedScore;

  return (
    <div className="bg-void-800 border border-void-700 p-6">
      <div className="flex items-center gap-2 mb-6 border-b border-void-700 pb-4">
        <Settings className="text-axiom-acid" size={20} />
        <h3 className="font-bold text-lg">REGULATORY STRESS TEST</h3>
      </div>

      <div className="space-y-6">
        {/* Scenario 1: Carbon Tax */}
        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-axiom-muted">Carbon/Emissions Tax Severity</span>
            <span className="text-axiom-acid">{regPressure}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={regPressure}
            onChange={(e) => setRegPressure(Number(e.target.value))}
            className="w-full h-2 bg-void-900 appearance-none cursor-pointer accent-axiom-acid"
          />
        </div>

        {/* Scenario 2: Labor Union Strength */}
        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-axiom-muted">Union/Labor Standards Audit</span>
            <span className="text-axiom-acid">{laborPressure}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={laborPressure}
            onChange={(e) => setLaborPressure(Number(e.target.value))}
            className="w-full h-2 bg-void-900 appearance-none cursor-pointer accent-axiom-acid"
          />
        </div>

        {/* The Result Box */}
        <div className="mt-8 bg-void-900 p-4 border border-void-700 flex justify-between items-center">
          <div>
            <p className="text-xs text-axiom-muted uppercase">Projected Survival Score</p>
            <div className={clsx(
              "text-3xl font-bold",
              projectedScore < 50 ? "text-axiom-crit" : "text-axiom-brand"
            )}>
              {projectedScore}
            </div>
          </div>
          
          {scoreDrop > 0 && (
            <div className="text-right">
              <p className="text-xs text-axiom-crit uppercase">Impact</p>
              <p className="text-xl font-mono text-axiom-crit">-{scoreDrop}</p>
            </div>
          )}
        </div>
        
        {/* Reset Button */}
        <button 
          onClick={() => { setRegPressure(0); setLaborPressure(0); }}
          className="flex items-center justify-center w-full py-2 text-xs text-axiom-muted hover:text-axiom-brand border border-transparent hover:border-void-700 transition-all"
        >
          <RefreshCw size={12} className="mr-2" /> RESET SIMULATION
        </button>
      </div>
    </div>
  );
}