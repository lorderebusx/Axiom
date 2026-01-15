"use client";

import { useState, useEffect } from "react";
import { getAllCompanies, Company } from "@/data/companies";
import CompanyCard from "@/components/CompanyCard";
import { Search, Filter, RefreshCw } from "lucide-react";

export default function Home() {
  // 1. Initialize Data
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

  // 2. Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  // 3. Load Data on Mount (Client-Side)
  useEffect(() => {
    const data = getAllCompanies();
    setAllCompanies(data);
    setFilteredCompanies(data);
  }, []);

  // 4. Extract Unique Industries for Dropdown
  const industries = ["All", ...Array.from(new Set(allCompanies.map(c => c.industry))).sort()];

  // 5. The Filter Engine
  useEffect(() => {
    let result = allCompanies;

    // Filter by Search
    if (searchTerm) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ticker.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Industry
    if (selectedIndustry !== "All") {
      result = result.filter(c => c.industry === selectedIndustry);
    }

    setFilteredCompanies(result);
  }, [searchTerm, selectedIndustry, allCompanies]);

  return (
    <main className="min-h-screen bg-void-900 text-axiom-brand">

      {/* HEADER & COMMAND BAR (Sticky) */}
      <div className="sticky top-0 z-50 bg-void-900/95 backdrop-blur border-b border-void-700 shadow-2xl">
        <div className="p-6 max-w-7xl mx-auto">

          {/* Title Area */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter text-axiom-brand">
                AXIOM_<span className="text-axiom-acid">v1</span>
              </h1>
              <p className="font-mono text-axiom-muted text-sm mt-1">
                Algorithmic ESG verification system. Detecting corporate greenwashing through statistical anomaly analysis.
              </p>
              <p className="font-mono text-axiom-muted text-sm mt-1">
                TRACKING {allCompanies.length} ENTITIES
              </p>
            </div>

            {/* Reset Button */}
            {(searchTerm || selectedIndustry !== "All") && (
              <button
                onClick={() => { setSearchTerm(""); setSelectedIndustry("All"); }}
                className="flex items-center text-xs text-axiom-crit hover:underline"
              >
                <RefreshCw size={12} className="mr-1" /> RESET_FILTERS
              </button>
            )}
          </div>

          {/* COMMAND BAR */}
          <div className="flex flex-col md:flex-row gap-4">

            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-3 text-axiom-muted group-focus-within:text-axiom-acid" size={18} />
              <input
                type="text"
                placeholder="SEARCH ENTITY OR TICKER..."
                className="w-full bg-void-800 border border-void-700 text-axiom-brand pl-10 pr-4 py-2.5 font-mono text-sm focus:outline-none focus:border-axiom-acid focus:ring-1 focus:ring-axiom-acid transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Industry Filter */}
            <div className="relative group w-full md:w-64">
              <Filter className="absolute left-3 top-3 text-axiom-muted group-focus-within:text-axiom-acid" size={18} />
              <select
                className="w-full appearance-none bg-void-800 border border-void-700 text-axiom-brand pl-10 pr-8 py-2.5 font-mono text-sm focus:outline-none focus:border-axiom-acid focus:ring-1 focus:ring-axiom-acid cursor-pointer transition-all"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind.toUpperCase()}</option>
                ))}
              </select>
              {/* Custom Arrow Icon */}
              <div className="absolute right-3 top-3 pointer-events-none text-axiom-muted">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                  <path d="M0 0L5 6L10 0H0Z" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* THE MASONRY GRID (No Gaps) */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* 'columns-1 md:columns-2 lg:columns-3' creates the Masonry layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-void-700 text-axiom-muted">
            <Filter size={48} className="mb-4 opacity-20" />
            <p className="font-mono">NO ENTITIES FOUND MATCHING PROTOCOLS.</p>
          </div>
        )}
      </div>
    </main>
  );
}