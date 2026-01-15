"use client";

import { useSearchParams } from "next/navigation";
import { getAllCompanies, Company } from "@/data/companies";
import { ArrowLeft, Trophy, AlertTriangle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import EsgRadar from "@/components/EsgRadar";
import clsx from "clsx";
import { Suspense } from "react";

function StandoffContent() {
    const searchParams = useSearchParams();
    const idA = searchParams.get("a");
    const idB = searchParams.get("b");
    const allCompanies = getAllCompanies();

    const companyA = allCompanies.find((c) => c.id === idA);
    const companyB = allCompanies.find((c) => c.id === idB);

    if (!companyA || !companyB) {
        return (
            <div className="min-h-screen bg-void-900 text-axiom-brand flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">ERROR: INSUFFICIENT DATA</h1>
                    <p className="text-axiom-muted mb-6">Two entities required for comparative analysis.</p>
                    <Link href="/" className="text-axiom-acid hover:underline">RETURN TO GRID</Link>
                </div>
            </div>
        );
    }

    // Helper to determine the "Winner" (Higher Score is Better)
    const getWinner = (valA: number, valB: number) => {
        if (valA > valB) return "A";
        if (valB > valA) return "B";
        return "DRAW";
    };

    // Prepare Radar Data (Overlay A vs B)
    const radarData = [
        { subject: "ENV", A: companyA.metrics.environment.score, B: companyB.metrics.environment.score, fullMark: 100 },
        { subject: "SOC", A: companyA.metrics.social.score, B: companyB.metrics.social.score, fullMark: 100 },
        { subject: "GOV", A: companyA.metrics.governance.score, B: companyB.metrics.governance.score, fullMark: 100 },
    ];

    return (
        <main className="min-h-screen bg-void-900 text-axiom-brand p-4 md:p-8 font-mono">
            {/* Header */}
            <div className="mb-8 border-b border-void-700 pb-4 flex justify-between items-end">
                <div>
                    <Link href="/" className="flex items-center text-axiom-muted hover:text-axiom-acid mb-2 text-xs">
                        <ArrowLeft size={12} className="mr-1" /> EXIT_STANDOFF
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tighter">
                        TACTICAL_<span className="text-axiom-acid">COMPARISON</span>
                    </h1>
                </div>
            </div>

            {/* THE ARENA Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT CORNER (Company A) */}
                <div className="space-y-6">
                    <div className="border-l-4 border-axiom-brand pl-4 py-2">
                        <h2 className="text-2xl font-bold">{companyA.name}</h2>
                        <div className="text-axiom-muted text-xs">{companyA.ticker} // {companyA.industry}</div>
                    </div>

                    <div className="bg-void-800 p-6 border border-void-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-black">A</div>
                        <p className="text-xs text-axiom-muted uppercase">Audit Score</p>
                        <div className={clsx("text-5xl font-bold", companyA.auditScore > companyB.auditScore ? "text-axiom-acid" : "text-axiom-muted")}>
                            {companyA.auditScore}
                        </div>
                    </div>

                    {/* Metrics A */}
                    <div className="space-y-2">
                        <MetricRow label="Environment" score={companyA.metrics.environment.score} opponent={companyB.metrics.environment.score} />
                        <MetricRow label="Social" score={companyA.metrics.social.score} opponent={companyB.metrics.social.score} />
                        <MetricRow label="Governance" score={companyA.metrics.governance.score} opponent={companyB.metrics.governance.score} />
                    </div>
                </div>

                {/* CENTER (The Analysis) */}
                <div className="flex flex-col items-center justify-start pt-8">
                    <div className="w-full h-[300px] mb-8 relative">
                        {/* We reuse the Radar component but with a small tweak for colors if needed, 
                    or just let the default generic one handle A vs B mapping */}
                        <EsgRadar data={radarData} />
                        <div className="absolute bottom-0 w-full text-center text-xs text-axiom-muted">
                            <span className="text-axiom-acid font-bold">GREEN: {companyA.ticker}</span> vs <span className="text-gray-500 font-bold">GREY: {companyB.ticker}</span>
                        </div>
                    </div>

                    <div className="w-full bg-void-800 border border-void-700 p-4 text-center">
                        <h3 className="text-axiom-acid text-sm font-bold mb-2 uppercase">Verdict</h3>
                        {companyA.auditScore !== companyB.auditScore ? (
                            <p className="text-sm">
                                <span className="font-bold text-white">
                                    {companyA.auditScore > companyB.auditScore ? companyA.name : companyB.name}
                                </span> is the statistically safer asset by <span className="text-axiom-acid">{Math.abs(companyA.auditScore - companyB.auditScore)} points</span>.
                            </p>
                        ) : (
                            <p className="text-sm">Statistical dead heat. Investigate specific risk flags.</p>
                        )}
                    </div>
                </div>

                {/* RIGHT CORNER (Company B) */}
                <div className="space-y-6 text-right">
                    <div className="border-r-4 border-gray-500 pr-4 py-2">
                        <h2 className="text-2xl font-bold text-gray-400">{companyB.name}</h2>
                        <div className="text-axiom-muted text-xs">{companyB.ticker} // {companyB.industry}</div>
                    </div>

                    <div className="bg-void-800 p-6 border border-void-700 relative overflow-hidden">
                        <div className="absolute top-0 left-0 p-2 opacity-10 text-6xl font-black">B</div>
                        <p className="text-xs text-axiom-muted uppercase">Audit Score</p>
                        <div className={clsx("text-5xl font-bold", companyB.auditScore > companyA.auditScore ? "text-axiom-acid" : "text-axiom-muted")}>
                            {companyB.auditScore}
                        </div>
                    </div>

                    {/* Metrics B (Reversed alignment) */}
                    <div className="space-y-2 flex flex-col items-end">
                        <MetricRow label="Environment" score={companyB.metrics.environment.score} opponent={companyA.metrics.environment.score} alignRight />
                        <MetricRow label="Social" score={companyB.metrics.social.score} opponent={companyA.metrics.social.score} alignRight />
                        <MetricRow label="Governance" score={companyB.metrics.governance.score} opponent={companyA.metrics.governance.score} alignRight />
                    </div>
                </div>

            </div>
        </main>
    );
}

// Helper Component for the rows
function MetricRow({ label, score, opponent, alignRight = false }: { label: string, score: number, opponent: number, alignRight?: boolean }) {
    const isWinner = score > opponent;
    const isLoser = score < opponent;

    return (
        <div className={clsx(
            "flex items-center gap-4 p-2 w-full border border-transparent transition-all",
            isWinner ? "bg-axiom-acid/5 border-axiom-acid/20" : "opacity-60",
            alignRight ? "flex-row-reverse" : "flex-row"
        )}>
            <div className={clsx("text-xs uppercase font-bold w-24", alignRight ? "text-right" : "text-left")}>{label}</div>

            <div className="flex-1 h-2 bg-void-900 relative">
                <div
                    className={clsx("h-full absolute top-0", alignRight ? "right-0" : "left-0", isWinner ? "bg-axiom-acid" : "bg-gray-600")}
                    style={{ width: `${score}%` }}
                />
            </div>

            <div className={clsx("font-bold font-mono text-lg", isWinner ? "text-axiom-acid" : "text-gray-500")}>
                {score}
            </div>
            {isWinner && <Trophy size={14} className="text-axiom-acid shrink-0" />}
            {isLoser && <div className="w-3.5" />} {/* Spacer */}
        </div>
    );
}

// Main Page Component (Must wrap in Suspense for useSearchParams)
export default function StandoffPage() {
    return (
        <Suspense fallback={<div className="p-12 text-axiom-brand">INITIALIZING BATTLEFIELD...</div>}>
            <StandoffContent />
        </Suspense>
    );
}