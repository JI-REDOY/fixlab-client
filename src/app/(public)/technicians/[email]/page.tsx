"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Wrench,
  Clock,
  Star,
  Loader2,
  Briefcase,
  ArrowUpRight,
} from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function TechnicianDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const decodedEmail = decodeURIComponent(String(params.email || "")).toLowerCase();
  const queryName = searchParams.get("name");
  const querySpecialty = searchParams.get("specialty");

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/api/services")
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const techServices = list.filter(
          (item: any) =>
            (item.technicianEmail || "").toLowerCase() === decodedEmail
        );
        setServices(techServices);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [decodedEmail]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="animate-spin text-[#ff5722]" size={48} />
      </div>
    );
  }

  const firstService = services[0];
  const technicianName =
    firstService?.technicianName ||
    queryName ||
    decodedEmail.split("@")[0] ||
    "Technician";
  const primaryArea = firstService?.serviceArea || "Dhaka, Bangladesh";
  const categories = Array.from(
    new Set(services.map((s: any) => s.category).filter(Boolean))
  );
  const specialtyLabel =
    categories.length > 0
      ? categories.join(" • ")
      : querySpecialty || "Appliance & Device Repair";

  return (
    <div className="w-full bg-transparent min-h-screen pb-24 relative overflow-hidden">
      {/* Subtle Orange Ambient Glows */}
      <div className="absolute top-10 right-0 w-[580px] h-[580px] bg-[#ff5722]/15 blur-[150px] rounded-full -translate-y-1/3 translate-x-1/3 z-0 pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-[#ff7043]/10 blur-[150px] rounded-full translate-y-1/3 -translate-x-1/3 z-0 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        {/* Back Button */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2.5 text-sm font-bold text-gray-800 hover:text-[#ff5722] transition-all duration-300 mb-8 bg-white/10 hover:bg-white/20 backdrop-blur-xs px-6 py-3 rounded-full border border-white/50 shadow-[0_8px_20px_rgba(0,0,0,0.04)]"
        >
          <ArrowLeft size={16} className="text-[#ff5722]" /> Back to Services
        </Link>

        {/* Technician Profile Header Card */}
        <div className="bg-white/10 backdrop-blur-xs p-8 sm:p-10 rounded-[3rem] shadow-[0_16px_40px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.65)] border border-white/50 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    technicianName
                  )}&background=ff5722&color=fff&bold=true`}
                  alt={technicianName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/80 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-white/95 rounded-full p-1.5 shadow-xs border border-[#ff5722]/20">
                  <ShieldCheck size={20} className="text-[#ff5722]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ff5722]/12 border border-[#ff5722]/20 text-[#ff5722] text-xs font-extrabold">
                  <ShieldCheck size={14} /> Verified Technician
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {technicianName}
                </h1>
                <p className="text-sm sm:text-base font-bold text-[#ff5722]">
                  {specialtyLabel}
                </p>
                <div className="flex flex-wrap gap-3 pt-1 text-xs sm:text-sm font-bold text-gray-700">
                  <span className="inline-flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-full border border-white/45">
                    <MapPin size={15} className="text-[#ff5722]" /> {primaryArea}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-full border border-white/45">
                    <Star size={15} className="text-[#ff5722]" fill="currentColor" /> 4.8 Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              <div className="bg-white/15 backdrop-blur-xs px-6 py-4 rounded-[2rem] border border-white/50 text-center">
                <p className="text-3xl font-extrabold text-[#ff5722]">
                  {services.length}
                </p>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-1">
                  Active Works
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-xs px-6 py-4 rounded-[2rem] border border-white/50 text-center">
                <p className="text-3xl font-extrabold text-gray-900">5+ Yr</p>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-1">
                  Experience
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-orange-300/40 to-transparent my-7" />

          <p className="text-gray-700 text-base leading-relaxed max-w-4xl">
            {technicianName} provides reliable repair and maintenance services with
            transparent base pricing, clear estimated durations, and post-completion
            payment protection.
          </p>
        </div>

        {/* Technician All Works / Services Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Briefcase className="text-[#ff5722]" size={22} />
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                All Services & Works ({services.length})
              </h2>
            </div>
          </div>

          {services.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-xs p-10 rounded-[2.5rem] border border-white/50 text-center text-gray-700 font-semibold">
              No active services found for this technician right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {services.map((item: any) => (
                <div
                  key={item._id}
                  className="bg-white/10 backdrop-blur-xs rounded-[2.5rem] p-5 border border-white/50 shadow-[0_14px_32px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.65)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    <div className="relative w-full h-48 rounded-[1.8rem] overflow-hidden mb-5 border border-white/40">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 px-3.5 py-1 rounded-full text-xs font-extrabold text-[#ff5722]">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-gray-900 mb-2 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-700 mb-5">
                      <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full border border-white/40">
                        <Wrench size={13} className="text-[#ff5722]" /> {item.serviceMode}
                      </span>
                      {item.estimatedDuration && (
                        <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full border border-white/40">
                          <Clock size={13} className="text-[#ff5722]" /> {item.estimatedDuration}
                        </span>
                      )}
                      {item.serviceArea && (
                        <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full border border-white/40">
                          <MapPin size={13} className="text-[#ff5722]" /> {item.serviceArea}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/35 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold text-gray-500 uppercase">
                        Starting from
                      </p>
                      <p className="text-2xl font-extrabold text-[#ff5722]">
                        ${item.basePrice}
                      </p>
                    </div>

                    <Link
                      href={`/services/${item._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#ff5722] hover:bg-[#e64a19] text-white text-xs font-extrabold transition-colors shadow-sm"
                    >
                      <span>Details</span>
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}