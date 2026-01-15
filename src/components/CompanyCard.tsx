import { Company } from "@/data/companies";
import clsx from "clsx";
import { AlertTriangle, TrendingDown, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function CompanyCard({ company, disableLink }: { company: Company, disableLink?: boolean }) {
    // Calculate the "Hypocrisy Gap"
    const gap = company.marketingScore - company.auditScore;

    const CardContent = (
        <div className="group relative break-inside-avoid mb-6 border border-void-700 bg-void-800 p-6 transition-all hover:border-axiom-acid hover:shadow-[0_0_15px_rgba(204,255,0,0.1)]">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-axiom-brand tracking-tight">
                        {company.name}
                    </h3>
                    <span className="text-xs font-mono text-axiom-muted">
                        {company.ticker} // {company.industry.toUpperCase()}
                    </span>
                </div>

                {/* Risk Badge */}
                <div className={clsx(
                    "px-2 py-1 text-xs font-bold border",
                    company.riskLevel === "Critical" ? "border-axiom-crit text-axiom-crit" :
                        company.riskLevel === "Medium" ? "border-axiom-alert text-axiom-alert" :
                            "border-axiom-acid text-axiom-acid"
                )}>
                    {company.riskLevel.toUpperCase()}
                </div>
            </div>

            {/* The Scores - The Core Visual */}
            <div className="grid grid-cols-2 gap-4 mb-4 font-mono text-sm">
                <div>
                    <p className="text-axiom-muted text-[10px] uppercase">Public Score</p>
                    <span className="text-2xl text-axiom-brand">{company.marketingScore}</span>
                </div>
                <div>
                    <p className="text-axiom-muted text-[10px] uppercase">Axiom Audit</p>
                    <span className={clsx("text-2xl", gap > 20 ? "text-axiom-crit" : "text-axiom-brand")}>
                        {company.auditScore}
                    </span>
                </div>
            </div>

            {/* The Hypocrisy Detector */}
            {gap > 10 && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-void-900 border border-void-700 text-xs text-axiom-alert">
                    <AlertTriangle size={14} />
                    <span>Divergence Detected: -{gap} pts</span>
                </div>
            )}

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-axiom-muted/50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-axiom-muted/50" />
        </div>
    );

    if (disableLink) return CardContent;

    return (
        <Link href={`/company/${company.id}`}>
            {CardContent}
        </Link>
    );
}