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
  Crown,
} from "lucide-react";
import { fetchApi } from "@/lib/api";

function isProEntryActive(entry: any): boolean {
  if (!entry) return false;

  const rawPro = Boolean(
    entry?.isVerifiedPro ||
      entry?.technicianIsVerifiedPro ||
      entry?.plan === "pro" ||
      entry?.technicianPlan === "pro" ||
      entry?.user?.isVerifiedPro ||
      entry?.user?.plan === "pro"
  );

  if (!rawPro) return false;

  const expiresAt =
    entry?.proExpiresAt ||
    entry?.technicianProExpiresAt ||
    entry?.user?.proExpiresAt ||
    null;

  if (expiresAt) {
    const expiryMs = new Date(expiresAt).getTime();
    if (!Number.isNaN(expiryMs) && expiryMs <= Date.now()) {
      return false;
    }
  }

  return true;
}

export default function TechnicianDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const rawParam = decodeURIComponent(String(params.email || "")).trim();
  const decodedEmail = rawParam.toLowerCase();
  const queryName = searchParams.get("name");
  const querySpecialty = searchParams.get("specialty");

  const [services, setServices] = useState<any[]>([]);
  const [matchedTech, setMatchedTech] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const extractList = (payload: any) => {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.services)) return payload.services;
      if (Array.isArray(payload?.technicians)) return payload.technicians;
      if (Array.isArray(payload?.data)) return payload.data;
      return [];
    };

    Promise.all([
      fetchApi("/api/services").catch(() => []),
      fetchApi("/api/public/technicians").catch(() => []),
    ])
      .then(([srvRes, techRes]) => {
        if (!active) return;

        const srvList = extractList(srvRes);
        const techServices = srvList.filter((item: any) => {
          const srvEmail = String(
            item.technicianEmail || item.email || item.userEmail || ""
          )
            .trim()
            .toLowerCase();
          const srvName = String(item.technicianName || item.name || "")
            .trim()
            .toLowerCase();
          const srvId = String(item._id || item.id || "")
            .trim()
            .toLowerCase();

          return (
            (decodedEmail && srvEmail === decodedEmail) ||
            (decodedEmail && srvName === decodedEmail) ||
            (decodedEmail && srvId === decodedEmail)
          );
        });
        setServices(techServices);

        const techList = extractList(techRes);
        const foundTech = techList.find((t: any) => {
          const tEmail = String(
            t.email || t.technicianEmail || t.userEmail || ""
          )
            .trim()
            .toLowerCase();
          const tName = String(t.name || "").trim().toLowerCase();
          const tId = String(t._id || t.id || "").trim().toLowerCase();

          return (
            (decodedEmail && tEmail === decodedEmail) ||
            (decodedEmail && tName === decodedEmail) ||
            (decodedEmail && tId === decodedEmail)
          );
        });
        setMatchedTech(foundTech || null);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
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
    matchedTech?.name ||
    queryName ||
    (decodedEmail.includes("@") ? decodedEmail.split("@")[0] : decodedEmail) ||
    "Technician";
  const primaryArea =
    firstService?.serviceArea || matchedTech?.location || "Dhaka, Bangladesh";
  const categories = Array.from(
    new Set(services.map((s: any) => s.category).filter(Boolean))
  );
  const specialtyLabel =
    categories.length > 0
      ? categories.join(" • ")
      : querySpecialty ||
        matchedTech?.specialty ||
        "Appliance & Device Repair";

  const isPro =
    isProEntryActive(matchedTech) ||
    services.some((item: any) => isProEntryActive(item));

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
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ff5722]/12 border border-[#ff5722]/20 text-[#ff5722] text-xs font-extrabold">
                    <ShieldCheck size={14} /> Verified Technician
                  </div>

                  {isPro && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white text-xs font-extrabold tracking-wider uppercase shadow-xs">
                      <Crown size={13} />
                      <span>PRO</span>
                    </span>
                  )}
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
                    <Star size={15} className="text-[#ff5722]" fill="currentColor" />{" "}
                    4.8 Rating
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
              {services.map((item: any) => {
                const itemIsPro = isPro || isProEntryActive(item);

                return (
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

                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-extrabold text-gray-900 line-clamp-1">
                          {item.title}
                        </h3>
                        {itemIsPro && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white text-[10px] font-extrabold tracking-wider uppercase shrink-0 shadow-2xs">
                            <Crown size={11} />
                            <span>PRO</span>
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-700 mb-5">
                        <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full border border-white/40">
                          <Wrench size={13} className="text-[#ff5722]" />{" "}
                          {item.serviceMode}
                        </span>
                        {item.estimatedDuration && (
                          <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full border border-white/40">
                            <Clock size={13} className="text-[#ff5722]" />{" "}
                            {item.estimatedDuration}
                          </span>
                        )}
                        {item.serviceArea && (
                          <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full border border-white/40">
                            <MapPin size={13} className="text-[#ff5722]" />{" "}
                            {item.serviceArea}
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}