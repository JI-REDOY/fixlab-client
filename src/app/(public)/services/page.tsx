"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ServiceCard from "@/components/cards/ServiceCard";
import {
  Search,
  ChevronDown,
  Loader2,
  Wrench,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { fetchApi } from "@/lib/api";

const categories = [
  "All",
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const modes = ["All", "Home Visit", "Shop Drop-off"];
const ITEMS_PER_PAGE = 8;

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [mode, setMode] = useState(searchParams.get("mode") || "All");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "All");
    setMode(searchParams.get("mode") || "All");
    setSort(searchParams.get("sort") || "newest");
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const query = new URLSearchParams();
    if (search.trim()) query.set("search", search.trim());
    if (category !== "All") query.set("category", category);
    if (mode !== "All") query.set("serviceMode", mode);
    if (sort !== "newest") query.set("sort", sort);

    const qs = query.toString();
    router.replace(qs ? `/services?${qs}` : "/services", { scroll: false });

    fetchApi(qs ? `/api/services?${qs}` : "/api/services")
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.services)
          ? data.services
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setServices(list);
      })
      .catch((err) => {
        console.error(err);
        if (active) setServices([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, category, mode, sort, router]);

  const hasActiveFilters =
    Boolean(search.trim()) ||
    category !== "All" ||
    mode !== "All" ||
    sort !== "newest";

  const handleClearFilters = () => {
    setSearch("");
    setCategory("All");
    setMode("All");
    setSort("newest");
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(services.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedServices = services.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="w-full bg-transparent min-h-screen pb-24 relative overflow-hidden">
      {/* Subtle Orange Ambient Glow */}
      <div className="absolute top-0 right-0 w-[620px] h-[620px] bg-[#ff5722]/12 blur-[140px] rounded-full -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 pt-32 pb-14 px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-[#ff5722]/10 border border-[#ff5722]/20 text-[#ff5722] font-extrabold tracking-wider uppercase text-xs mb-4 shadow-2xs">
          <Sparkles size={13} /> Service Catalog
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Browse <span className="text-[#ff5722]">Services</span>
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
          Find the perfect repair service for your device. Book verified
          technicians with transparent pricing.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Filter Bar (Soft Glass + Inset UI) */}
        <div className="bg-white/15 backdrop-blur-md rounded-[2rem] lg:rounded-full shadow-[8px_8px_18px_rgba(0,0,0,0.05),-8px_-8px_18px_rgba(255,255,255,0.5)] p-2.5 sm:p-3 mb-10 flex flex-col lg:flex-row gap-2.5 items-center justify-between border border-white/40">
          {/* Search Input (Soft Inset UI) */}
          <div className="relative w-full lg:w-1/3">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              size={19}
            />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-white/25 rounded-full border-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.65)] focus:ring-2 focus:ring-[#ff5722]/25 outline-none text-sm font-bold text-gray-800 placeholder-gray-500 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto items-stretch sm:items-center">
            {/* Category Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none w-full sm:w-[165px] pl-5 pr-10 py-3 bg-white/25 rounded-full border-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.65)] focus:ring-2 focus:ring-[#ff5722]/25 outline-none text-sm font-bold text-gray-800 cursor-pointer transition-all"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-white text-gray-900">
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                size={18}
              />
            </div>

            {/* Mode Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none w-full sm:w-[165px] pl-5 pr-10 py-3 bg-white/25 rounded-full border-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.65)] focus:ring-2 focus:ring-[#ff5722]/25 outline-none text-sm font-bold text-gray-800 cursor-pointer transition-all"
              >
                {modes.map((m) => (
                  <option key={m} value={m} className="bg-white text-gray-900">
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                size={18}
              />
            </div>

            {/* Sort Dropdown (Orange) */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none w-full sm:w-[185px] pl-5 pr-10 py-3 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white rounded-full border-none shadow-[4px_4px_12px_rgba(255,87,34,0.3)] outline-none text-sm font-bold cursor-pointer transition-all"
              >
                <option value="newest" className="bg-white text-gray-900">
                  Newest First
                </option>
                <option value="price-low" className="bg-white text-gray-900">
                  Price: Low to High
                </option>
                <option value="price-high" className="bg-white text-gray-900">
                  Price: High to Low
                </option>
              </select>
              <ChevronDown
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white pointer-events-none"
                size={18}
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full bg-white/25 hover:bg-white/40 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.04),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] text-xs font-extrabold text-gray-800 hover:text-[#ff5722] transition-all cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        {!loading && services.length > 0 && (
          <div className="flex items-center justify-between mb-6 px-1 text-xs sm:text-sm font-bold text-gray-700">
            <span>
              Showing{" "}
              <strong className="text-[#ff5722]">{paginatedServices.length}</strong>{" "}
              of <strong className="text-gray-900">{services.length}</strong>{" "}
              services
            </span>
            {totalPages > 1 && (
              <span>
                Page {safePage} of {totalPages}
              </span>
            )}
          </div>
        )}

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#ff5722]" size={48} />
          </div>
        ) : paginatedServices.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedServices.map((service) => (
                <ServiceCard
                  key={service._id || service.id}
                  service={service}
                />
              ))}
            </div>

            {/* Pagination (Shown only when items exceed one page) */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full bg-white/20 border border-white/50 text-xs font-extrabold text-gray-800 hover:border-[#ff5722]/40 hover:text-[#ff5722] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                        safePage === pageNum
                          ? "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white shadow-sm"
                          : "bg-white/20 border border-white/50 text-gray-800 hover:border-[#ff5722]/40 hover:text-[#ff5722]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safePage === totalPages}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full bg-white/20 border border-white/50 text-xs font-extrabold text-gray-800 hover:border-[#ff5722]/40 hover:text-[#ff5722] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white/15 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-sm">
            <div className="w-24 h-24 bg-white/25 rounded-full flex items-center justify-center mb-6 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]">
              <Wrench size={40} className="text-gray-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-700 font-medium mb-8 max-w-md mx-auto">
              We couldn&apos;t find any services matching your search. Try
              adjusting your filters.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-8 py-3.5 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white font-extrabold rounded-full hover:from-[#e64a19] hover:to-[#ff5722] transition-all shadow-[0_8px_20px_rgba(255,87,34,0.3)] hover:-translate-y-0.5 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-[#ff5722]" size={48} />
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}