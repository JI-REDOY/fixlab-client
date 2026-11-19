"use client";

import { useState, useEffect } from "react";
import ServiceCard from "../cards/ServiceCard";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function FeaturedServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/api/services/featured")
      .then((data) => setServices(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-fixlab-charcoal mb-2">Featured Services</h2>
          <p className="text-fixlab-gray">Our top-rated repair services by verified technicians.</p>
        </div>
        <Link href="/services" className="hidden sm:flex items-center gap-2 text-fixlab-green font-bold hover:underline">
          View All <ArrowRight size={18} />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-fixlab-green" size={40} /></div>
      ) : services.length === 0 ? (
        <div className="text-center py-10 text-fixlab-gray">No services available yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
      
      <div className="mt-8 flex justify-center sm:hidden">
        <Link href="/services" className="flex items-center gap-2 text-fixlab-green font-bold hover:underline">
          View All Services <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}