"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  CheckCircle2,
  ArrowUpRight,
  Wrench,
  Loader2,
  Sparkles,
} from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function TopTechnicians() {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const extractList = (payload: any) => {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.technicians)) return payload.technicians;
      if (Array.isArray(payload?.services)) return payload.services;
      if (Array.isArray(payload?.data)) return payload.data;
      return [];
    };

    Promise.all([
      fetchApi("/api/public/technicians").catch(() => []),
      fetchApi("/api/services").catch(() => []),
    ])
      .then(([techRes, srvRes]) => {
        if (!active) return;

        const techList = extractList(techRes);
        const srvList = extractList(srvRes);
        setServices(srvList);

        if (techList.length > 0) {
          setTechnicians(techList);
        } else {
          const map = new Map<string, any>();
          srvList.forEach((srv: any, idx: number) => {
            const email = String(
              srv.technicianEmail || srv.email || srv.userEmail || ""
            ).trim();
            const name = String(srv.technicianName || srv.name || "").trim();
            const key = (email || name || `tech-${idx}`).toLowerCase();

            if (!map.has(key)) {
              map.set(key, {
                _id: srv._id || srv.id || key,
                name: name || (email ? email.split("@")[0] : "Technician"),
                email,
                specialty: srv.category || "",
                location: srv.serviceArea || "",
                rating: srv.rating,
                reviews: srv.reviews,
                image: srv.technicianImage || srv.avatar || "",
              });
            }
          });
          setTechnicians(Array.from(map.values()));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const getTechWorks = (tech: any) => {
    const techEmail = String(
      tech.email || tech.technicianEmail || tech.userEmail || tech.contactEmail || ""
    )
      .trim()
      .toLowerCase();
    const techName = String(tech.name || "").trim().toLowerCase();

    return services.filter((srv: any) => {
      const srvEmail = String(
        srv.technicianEmail || srv.email || srv.userEmail || ""
      )
        .trim()
        .toLowerCase();
      const srvName = String(srv.technicianName || srv.name || "")
        .trim()
        .toLowerCase();

      if (techEmail && srvEmail && srvEmail === techEmail) return true;
      if (techName && srvName && srvName === techName) return true;
      return false;
    });
  };

  const getTechnicianProfileHref = (tech: any, techWorks: any[], index: number) => {
    const matchedWorkEmail = String(
      techWorks[0]?.technicianEmail ||
        techWorks[0]?.email ||
        techWorks[0]?.userEmail ||
        ""
    ).trim();

    const rawIdentifier = String(
      tech.email ||
        tech.technicianEmail ||
        tech.userEmail ||
        tech.contactEmail ||
        matchedWorkEmail ||
        tech.name ||
        tech._id ||
        tech.id ||
        `technician-${index + 1}`
    ).trim();

    const params = new URLSearchParams();
    if (tech.name) params.set("name", tech.name);
    if (tech.specialty || tech.skill || tech.category) {
      params.set("specialty", tech.specialty || tech.skill || tech.category);
    }

    const queryString = params.toString();
    return `/technicians/${encodeURIComponent(rawIdentifier)}${
      queryString ? `?${queryString}` : ""
    }`;
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="animate-spin text-[#ff5722]" size={40} />
      </div>
    );
  }

  if (technicians.length === 0) {
    return null;
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle Orange Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[340px] bg-[#ff5722]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-[#ff5722]/10 border border-[#ff5722]/20 text-[#ff5722] font-extrabold tracking-wider uppercase text-xs mb-4 shadow-2xs">
            <Sparkles size={13} /> Our Experts
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
            Top Rated <span className="text-[#ff5722]">Technicians</span>
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
            Meet our highly skilled and verified professionals ready to fix your
            devices.
          </p>
        </div>

        {/* Technicians Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {technicians.map((tech, index) => {
            const techWorks = getTechWorks(tech);
            const profileHref = getTechnicianProfileHref(tech, techWorks, index);
            const displayImage =
              tech.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                tech.name || "Technician"
              )}&background=ff5722&color=fff&bold=true`;
            const locationShort = tech.location
              ? String(tech.location).split(",")[0]
              : "";
            const badgeText = tech.specialty || tech.skill || tech.category;

            return (
              <div
                key={tech._id || tech.id || index}
                className="group relative flex flex-col items-center bg-white/15 backdrop-blur-xs border border-white/50 rounded-[2.25rem] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-400 hover:-translate-y-1.5 hover:bg-white/18 hover:shadow-[0_14px_30px_rgba(255,87,34,0.08)] hover:border-[#ff5722]/35"
              >
                {/* Soft Subtle Hover Shine */}
                <div className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/8 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.1s] ease-in-out pointer-events-none rounded-[2.25rem]" />

                {/* Avatar with Verified Badge */}
                <Link
                  href={profileHref}
                  className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#ff5722] to-[#ff8a65] shadow-sm mb-4 group-hover:scale-103 transition-transform duration-400 shrink-0"
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white bg-white">
                    <img
                      src={displayImage}
                      alt={tech.name || "Technician"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    title="Verified Technician"
                    className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-2xs border border-[#ff5722]/20"
                  >
                    <CheckCircle2 size={20} className="text-[#ff5722]" />
                  </div>
                </Link>

                {/* Name & Specialty */}
                {tech.name && (
                  <Link
                    href={profileHref}
                    className="text-lg font-extrabold text-gray-900 group-hover:text-[#ff5722] transition-colors mb-1 text-center line-clamp-1"
                  >
                    {tech.name}
                  </Link>
                )}

                {badgeText && (
                  <p className="text-xs font-bold text-[#ff5722] bg-[#ff5722]/10 border border-[#ff5722]/20 px-3 py-1 rounded-full mb-3 flex items-center gap-1.5 line-clamp-1">
                    <Wrench size={12} className="shrink-0" />
                    <span>{badgeText}</span>
                  </p>
                )}

                {/* Technician's Real Services Inside Card */}
                {techWorks.length > 0 && (
                  <div className="w-full flex flex-col gap-1.5 mb-4 relative z-30">
                    {techWorks.slice(0, 2).map((work: any, wIdx: number) => (
                      <Link
                        key={work._id || work.id || wIdx}
                        href={`/services/${work._id || work.id}`}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/45 text-left transition-colors"
                      >
                        <span className="text-xs font-bold text-gray-800 truncate">
                          {work.title}
                        </span>
                        {work.basePrice !== undefined && (
                          <span className="text-xs font-extrabold text-[#ff5722] shrink-0">
                            ${work.basePrice}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Rating, Location & Profile Link */}
                <div className="w-full flex flex-col gap-3 border-t border-white/40 pt-4 mt-auto relative z-30">
                  <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-gray-800">
                    {tech.rating !== undefined && (
                      <div className="flex items-center gap-1">
                        <Star
                          size={16}
                          className="text-amber-400 fill-amber-400 shrink-0"
                        />
                        <span>{tech.rating}</span>
                        {tech.reviews !== undefined && (
                          <span className="text-xs text-gray-600 font-semibold">
                            ({tech.reviews})
                          </span>
                        )}
                      </div>
                    )}
                    {locationShort && (
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-700 ml-auto">
                        <MapPin size={14} className="text-[#ff5722] shrink-0" />
                        <span>{locationShort}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={profileHref}
                    className="w-full py-2.5 px-4 rounded-full text-xs font-extrabold text-[#ff5722] bg-white/15 hover:bg-gradient-to-r hover:from-[#ff5722] hover:to-[#ff6d3f] hover:text-white border border-[#ff5722]/25 backdrop-blur-xs transition-all duration-300 flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>View Profile ({techWorks.length} Works)</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 backdrop-blur-xs border border-white/50 text-gray-900 font-extrabold text-sm rounded-full hover:bg-gradient-to-r hover:from-[#ff5722] hover:to-[#ff6d3f] hover:border-[#ff5722] hover:text-white transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_24px_rgba(255,87,34,0.2)] hover:-translate-y-0.5"
          >
            <span>Explore All Services</span>
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}