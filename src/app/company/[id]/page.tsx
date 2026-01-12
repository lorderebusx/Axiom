import { getAllCompanies, heroCompanies } from "@/data/companies";
import EsgRadar from "@/components/EsgRadar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import StressTest from "@/components/StressTest";
import clsx from "clsx";

// This helps Next.js know which pages to build
export function generateStaticParams() {
return heroCompanies.map((company) => ({
    id: company.id,
}));
}

// 1. Note the 'async' keyword and the Promise type for params
export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {

// 2. Await the params to get the ID
const { id } = await params;

// 3. Use the awaited ID to find the company
const company = heroCompanies.find((c) => c.id === id);

if (!company) {
    notFound();
}

// Format data for the Radar Chart
const chartData = [
    { subject: "ENVIRONMENT", A: company.metrics.environment.score, fullMark: 100 },
    { subject: "SOCIAL", A: company.metrics.social.score, fullMark: 100 },
    { subject: "GOVERNANCE", A: company.metrics.governance.score, fullMark: 100 },
];

return (
    <main className="min-h-screen bg-void-900 text-axiom-brand p-8 md:p-12 font-mono">
    {/* Back Button */}
    <Link href="/" className="flex items-center text-axiom-muted hover:text-axiom-acid mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        RETURN_TO_GRID
    </Link>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Radar */}
        <div className="lg:col-span-1 space-y-6">
        <div className="border-l-2 border-axiom-acid pl-4">
            <h1 className="text-4xl font-bold mb-1">{company.name}</h1>
            <p className="text-axiom-muted">{company.ticker} // {company.industry}</p>
        </div>

        <EsgRadar data={chartData} />

        <div className="bg-void-800 p-6 border border-void-700">
            <h3 className="text-axiom-muted text-xs uppercase mb-2">Axiom Audit Score</h3>
            <div className="text-5xl font-bold text-axiom-brand">{company.auditScore}</div>
        </div>
        <StressTest company={company} />
        </div>

        {/* Right Column: The Investigation (Metrics) */}
        <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl border-b border-void-700 pb-2 mb-4">Risk Analysis Report</h2>
        
        {/* Metric Rows */}
        {Object.entries(company.metrics).map(([key, metric]) => (
            <div key={key} className="bg-void-800 p-4 border border-void-700 hover:border-axiom-muted transition-colors">
            <div className="flex justify-between items-center mb-2">
                <span className="uppercase text-sm font-bold tracking-wider">{key}</span>
                <span className={clsx(
                "text-xl font-bold",
                metric.score < 50 ? "text-axiom-crit" : "text-axiom-brand"
                )}>
                {metric.score}/100
                </span>
            </div>
            
            {/* The "Gap" Bar */}
            <div className="w-full bg-void-900 h-2 mb-2 relative">
                <div 
                className={clsx("h-full", metric.score < 50 ? "bg-axiom-crit" : "bg-axiom-acid")} 
                style={{ width: `${metric.score}%` }} 
                />
            </div>

            {/* Flags / Issues */}
            {metric.flags.length > 0 ? (
                <div className="mt-2 space-y-1">
                {metric.flags.map(flag => (
                    <div key={flag} className="flex items-center text-xs text-axiom-alert">
                    <AlertTriangle size={12} className="mr-2" />
                    {flag.toUpperCase()}
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-xs text-axiom-muted">No critical flags detected.</p>
            )}
            </div>
        ))}
        </div>

    </div>
    </main>
);
}