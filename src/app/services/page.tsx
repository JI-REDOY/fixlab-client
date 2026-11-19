"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ServiceCard from "@/components/cards/ServiceCard";
import { Search, Filter, ChevronDown, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

const categories = ["All", "Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical"];
const modes = ["All", "Home Visit", "Shop Drop-off"];

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [mode, setMode] = useState(searchParams.get("mode") || "All");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (category !== "All") query.set("category", category);
    if (mode !== "All") query.set("mode", mode);
    if (sort !== "newest") query.set("sort", sort);

    router.replace(`/services?${query.toString()}`, { scroll: false });

    fetchApi(`/api/services?${query.toString()}`)
      .then((data) => setServices(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [search, category, mode, sort, router]);

  return (
    <div className="w-full bg-[#F8F9FA] min-h-screen pb-20">
      <div className="bg-fixlab-green py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Browse Services</h1>
        <p className="text-fixlab-mint max-w-2xl mx-auto">
          Find the perfect repair service for your device. Book verified technicians with just a few clicks.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 mb-10 flex flex-col lg:flex-row gap-4 items-center justify-between relative z-10 border border-gray-100">
          
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fixlab-gray" size={20} />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-fixlab-cream rounded-2xl border-none focus:ring-2 focus:ring-fixlab-green/20 outline-none text-sm font-medium"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="appearance-none w-full sm:w-[160px] pl-4 pr-10 py-3.5 bg-fixlab-cream rounded-2xl border-none focus:ring-2 focus:ring-fixlab-green/20 outline-none text-sm font-medium cursor-pointer">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-fixlab-gray pointer-events-none" size={18} />
            </div>

            <div className="relative">
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="appearance-none w-full sm:w-[160px] pl-4 pr-10 py-3.5 bg-fixlab-cream rounded-2xl border-none focus:ring-2 focus:ring-fixlab-green/20 outline-none text-sm font-medium cursor-pointer">
                {modes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-fixlab-gray pointer-events-none" size={18} />
            </div>

            <div className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none w-full sm:w-[180px] pl-4 pr-10 py-3.5 bg-fixlab-green text-white rounded-2xl border-none focus:ring-2 focus:ring-fixlab-green/20 outline-none text-sm font-medium cursor-pointer">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-fixlab-green" size={40} /></div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-fixlab-cream rounded-full flex items-center justify-center mb-6">
              <Filter size={40} className="text-fixlab-gray" />
            </div>
            <h3 className="text-2xl font-bold text-fixlab-charcoal mb-2">No services found</h3>
            <p className="text-fixlab-gray mb-6">Try adjusting your search or filters to find what you need.</p>
            <button onClick={() => { setSearch(""); setCategory("All"); setMode("All"); }} className="px-6 py-3 bg-fixlab-green text-white font-bold rounded-full hover:bg-opacity-90 transition-all">
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-fixlab-green" size={48} /></div>}>
      <ServicesContent />
    </Suspense>
  );
}