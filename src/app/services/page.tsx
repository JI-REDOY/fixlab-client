"use client";

import { useState } from "react";
import ServiceCard from "@/components/cards/ServiceCard";
import { Search, Filter, ChevronDown } from "lucide-react";

// ডামি ডেটা (পরে সার্ভার থেকে আসবে)
const allServices = [
  { _id: "1", title: "iPhone Screen Replacement", category: "Smartphone", image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800", basePrice: 49, serviceMode: "Home Visit", serviceArea: "Dhanmondi, Dhaka", technicianName: "Rahim Uddin" },
  { _id: "2", title: "MacBook Pro Battery Repair", category: "Laptop & PC", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800", basePrice: 89, serviceMode: "Shop Drop-off", serviceArea: "Mirpur, Dhaka", technicianName: "Karim Ahmed" },
  { _id: "3", title: "AC Servicing & Gas Refill", category: "AC", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800", basePrice: 35, serviceMode: "Home Visit", serviceArea: "Uttara, Dhaka", technicianName: "Rahim Uddin" },
  { _id: "4", title: "Refrigerator Cooling Issue", category: "Refrigerator", image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=800", basePrice: 55, serviceMode: "Home Visit", serviceArea: "Gulshan, Dhaka", technicianName: "Karim Ahmed" },
  { _id: "5", title: "Washing Machine Motor Fix", category: "Washing Machine", image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=800", basePrice: 40, serviceMode: "Shop Drop-off", serviceArea: "Banani, Dhaka", technicianName: "Jamil Khan" },
  { _id: "6", title: "Smart TV Screen Repair", category: "TV", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800", basePrice: 75, serviceMode: "Home Visit", serviceArea: "Mohakhali, Dhaka", technicianName: "Rahim Uddin" },
];

const categories = ["All", "Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical"];
const modes = ["All", "Home Visit", "Shop Drop-off"];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [mode, setMode] = useState("All");
  const [sort, setSort] = useState("newest");

  // ফিল্টার এবং সার্চ লজিক (পরে সার্ভার সাইডে হবে)
  const filteredServices = allServices.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || service.category === category;
    const matchesMode = mode === "All" || service.serviceMode === mode;
    return matchesSearch && matchesCategory && matchesMode;
  }).sort((a, b) => {
    if (sort === "price-low") return a.basePrice - b.basePrice;
    if (sort === "price-high") return b.basePrice - a.basePrice;
    return 0; // Newest
  });

  return (
    <div className="w-full bg-[#F8F9FA] min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-fixlab-green py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Browse Services</h1>
        <p className="text-fixlab-mint max-w-2xl mx-auto">
          Find the perfect repair service for your device. Book verified technicians with just a few clicks.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 mb-10 flex flex-col lg:flex-row gap-4 items-center justify-between relative z-10 border border-gray-100">
          
          {/* Search */}
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Category */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none w-full sm:w-[180px] pl-4 pr-10 py-3.5 bg-fixlab-cream rounded-2xl border-none focus:ring-2 focus:ring-fixlab-green/20 outline-none text-sm font-medium cursor-pointer"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-fixlab-gray pointer-events-none" size={18} />
            </div>

            {/* Mode */}
            <div className="relative">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="appearance-none w-full sm:w-[180px] pl-4 pr-10 py-3.5 bg-fixlab-cream rounded-2xl border-none focus:ring-2 focus:ring-fixlab-green/20 outline-none text-sm font-medium cursor-pointer"
              >
                {modes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-fixlab-gray pointer-events-none" size={18} />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none w-full sm:w-[180px] pl-4 pr-10 py-3.5 bg-fixlab-green text-white rounded-2xl border-none focus:ring-2 focus:ring-fixlab-green/20 outline-none text-sm font-medium cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-fixlab-cream rounded-full flex items-center justify-center mb-6">
              <Filter size={40} className="text-fixlab-gray" />
            </div>
            <h3 className="text-2xl font-bold text-fixlab-charcoal mb-2">No services found</h3>
            <p className="text-fixlab-gray mb-6">Try adjusting your search or filters to find what you need.</p>
            <button 
              onClick={() => { setSearch(""); setCategory("All"); setMode("All"); }}
              className="px-6 py-3 bg-fixlab-green text-white font-bold rounded-full hover:bg-opacity-90 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}