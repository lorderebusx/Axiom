import { getAllCompanies } from "@/data/companies";
import CompanyCard from "@/components/CompanyCard";

export default function Home() {
  const companies = getAllCompanies();

  return (
    <main className="min-h-screen bg-void-900 text-axiom-brand p-8 md:p-12">
      {/* Header Section */}
      <header className="mb-12 border-b border-void-700 pb-6">
        <h1 className="text-4xl font-bold tracking-tighter text-axiom-brand mb-2">
          AXIOM_
        </h1>
        <p className="font-mono text-axiom-muted text-sm max-w-lg">
          Algorithmic ESG verification system. Detecting corporate greenwashing through statistical anomaly analysis.
        </p>
      </header>

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </main>
  );
}