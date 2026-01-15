"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCompanies, Company } from "@/data/companies";
import CompanyCard from "@/components/CompanyCard";
import { Search, Filter, RefreshCw, Network, Swords } from "lucide-react";
import clsx from "clsx";

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  // Compare Mode States
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    const data = getAllCompanies();
    setAllCompanies(data);
    setFilteredCompanies(data);
  }, []);

  // --- FILTER ENGINE ---
  useEffect(() => {
    let result = allCompanies;

    if (searchTerm) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ticker.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry !== "All") {
      result = result.filter(c => c.industry === selectedIndustry);
    }

    setFilteredCompanies(result);
  }, [searchTerm, selectedIndustry, allCompanies]);

  // Extract Unique Industries for Dropdown
  const industries = ["All", ...Array.from(new Set(allCompanies.map(c => c.industry))).sort()];

  // --- HANDLERS ---
  const handleCardClick = (e: React.MouseEvent, id: string) => {
    if (!compareMode) return; // Allow normal navigation if not comparing

    e.preventDefault(); // Block Link navigation

    if (selectedForCompare.includes(id)) {
      // Deselect
      setSelectedForCompare(prev => prev.filter(item => item !== id));
    } else {
      // Select (Limit to 2)
      if (selectedForCompare.length < 2) {
        setSelectedForCompare(prev => [...prev, id]);
      }
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedIndustry("All");
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    setSelectedForCompare([]); // Clear selection when toggling
  };

  return (
    <main className="min-h-screen bg-void-900 text-axiom-brand">

      {/* --- STICKY HEADER & COMMAND BAR --- */}
      <div className="sticky top-0 z-50 bg-void-900/95 backdrop-blur border-b border-void-700 shadow-2xl transition-all">
        <div className="p-6 max-w-7xl mx-auto">

          {/* Top Row: Title & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter text-axiom-brand">
                AXIOM_<span className="text-axiom-acid">v1</span>
              </h1>
              <p className="font-mono text-axiom-muted text-xs mt-1">
                Algorithmic ESG verification system. Detecting corporate greenwashing through statistical anomaly analysis.
              </p>
              <p className="font-mono text-axiom-muted text-xs mt-1">
                TRACKING {allCompanies.length} ENTITIES
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 items-center">

              {/* Reset Filters (Only visible if active) */}
              {(searchTerm || selectedIndustry !== "All") && (
                <button
                  onClick={resetFilters}
                  className="flex items-center text-xs text-axiom-crit hover:underline mr-2"
                >
                  <RefreshCw size={12} className="mr-1" /> RESET
                </button>
              )}

              {/* Nexus Graph Button */}
              <Link
                href="/nexus"
                className="flex items-center text-xs font-bold text-axiom-brand border border-void-700 bg-void-800 px-3 py-1.5 hover:border-axiom-acid hover:text-axiom-acid transition-all"
              >
                <Network size={14} className="mr-2" />
                OPEN_NEXUS
              </Link>

              {/* Compare Toggle */}
              <button
                onClick={toggleCompareMode}
                className={clsx(
                  "flex items-center text-xs font-bold border px-3 py-1.5 transition-all",
                  compareMode
                    ? "bg-axiom-acid text-void-900 border-axiom-acid"
                    : "bg-void-800 text-axiom-brand border-void-700 hover:border-axiom-acid"
                )}
              >
                <Swords size={14} className="mr-2" />
                {compareMode ? "CANCEL_COMPARE" : "COMPARE_ENTITIES"}
              </button>

              {/* Launch Standoff Button (Conditional) */}
              {compareMode && selectedForCompare.length === 2 && (
                <Link
                  href={`/standoff?a=${selectedForCompare[0]}&b=${selectedForCompare[1]}`}
                  className="bg-axiom-crit text-white px-4 py-1.5 text-xs font-bold flex items-center animate-pulse hover:bg-red-600 transition-colors"
                >
                  INITIATE STANDOFF &rarr;
                </Link>
              )}
            </div>
          </div>

          {/* Bottom Row: Inputs */}
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
              <div className="absolute right-3 top-3 pointer-events-none text-axiom-muted">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                  <path d="M0 0L5 6L10 0H0Z" />
                </svg>
              </div>
            </div>

          </div>
        </div>

        {/* Compare Mode Message Banner */}
        {compareMode && (
          <div className="bg-axiom-acid/10 border-b border-axiom-acid/20 py-1 text-center">
            <p className="text-xs text-axiom-acid font-mono font-bold animate-pulse">
              SELECT TWO ENTITIES TO COMPARE [{selectedForCompare.length}/2]
            </p>
          </div>
        )}
      </div>

      {/* --- MASONRY GRID --- */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              onClick={(e) => handleCardClick(e, company.id)}
              className={clsx(
                "transition-all duration-200",
                compareMode ? "cursor-pointer" : "",
                // Selection Visuals
                selectedForCompare.includes(company.id) ? "ring-2 ring-axiom-acid scale-[1.02] z-10 shadow-lg shadow-axiom-acid/10" : "",
                // Dim non-selected items if selection is full
                compareMode && selectedForCompare.length === 2 && !selectedForCompare.includes(company.id) ? "opacity-40 grayscale blur-[1px]" : ""
              )}
            >
              {/* Pass disableLink so we can hijack the click event */}
              <CompanyCard company={company} disableLink={compareMode} />
            </div>
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