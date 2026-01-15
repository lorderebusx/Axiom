import { getAllCompanies } from "@/data/companies";
import NexusGraph from "@/components/NexusGraph";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NexusPage() {
    const companies = getAllCompanies();

    return (
        <main className="min-h-screen bg-void-900 text-axiom-brand p-8 md:p-12">
            {/* Header */}
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <Link href="/" className="flex items-center text-axiom-muted hover:text-axiom-acid mb-4 transition-colors text-sm font-mono">
                        <ArrowLeft size={14} className="mr-2" />
                        RETURN_TO_GRID
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tighter text-axiom-brand">
                        NEXUS_<span className="text-axiom-acid">RELAYS</span>
                    </h1>
                    <p className="font-mono text-axiom-muted text-xs mt-1 max-w-2xl">
                        Visualizing hidden governance links. Lines represent shared board membership.
                        Clusters indicate centralized control.
                    </p>
                </div>
            </div>

            {/* The Graph Container */}
            <NexusGraph data={companies} />

        </main>
    );
}