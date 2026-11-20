"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  MapPin,
  ShieldCheck,
  Wrench,
  Star,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { fetchApi } from "@/lib/api";
import RequestModal from "@/components/forms/RequestModal";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchApi(`/api/services/${params.id}`)
      .then((data) => setService(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleRequestClick = () => {
    if (!session) {
      router.push(`/sign-in?redirect=/services/${params.id}`);
    } else if (session.user.role === "technician" || session.user.role === "admin") {
      return;
    } else {
      setIsModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="animate-spin text-[#ff5722]" size={48} />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 bg-transparent">
        Service not found.
      </div>
    );
  }

  const isRestrictedRole =
    session?.user?.role === "technician" || session?.user?.role === "admin";

  const technicianProfileHref = service.technicianEmail
    ? `/technicians/${encodeURIComponent(service.technicianEmail)}?name=${encodeURIComponent(
        service.technicianName || "Technician"
      )}&specialty=${encodeURIComponent(service.category || "Repair")}`
    : "/services";

  return (
    <div className="w-full bg-transparent min-h-screen pb-24 relative overflow-hidden">
      {/* Subtle Orange Ambient Glows */}
      <div className="absolute top-10 right-0 w-[580px] h-[580px] bg-[#ff5722]/15 blur-[150px] rounded-full -translate-y-1/3 translate-x-1/3 z-0 pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-[#ff7043]/10 blur-[150px] rounded-full translate-y-1/3 -translate-x-1/3 z-0 pointer-events-none" />

      {/* Back Navigation */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        <Link
          href="/services"
          className="inline-flex items-center gap-2.5 text-sm font-bold text-gray-800 hover:text-[#ff5722] transition-all duration-300 mb-8 bg-white/10 hover:bg-white/20 backdrop-blur-xs px-6 py-3 rounded-full border border-white/50 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:-translate-x-0.5"
        >
          <ArrowLeft size={16} className="text-[#ff5722]" /> Back to Services
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative z-10">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Main Image Frame */}
          <div className="relative w-full h-[300px] sm:h-[480px] rounded-[3rem] overflow-hidden shadow-[0_24px_55px_rgba(0,0,0,0.08)] border border-white/50 p-2.5 bg-white/5 backdrop-blur-xs group">
            <div className="relative w-full h-full rounded-[2.4rem] overflow-hidden">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="absolute top-7 left-7 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold text-[#ff5722] shadow-sm border border-white/70">
              <Sparkles size={14} /> {service.category}
            </div>
          </div>

          {/* Service Info Card */}
          <div className="bg-white/10 backdrop-blur-xs p-8 sm:p-10 rounded-[3rem] shadow-[0_16px_40px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.65)] border border-white/50 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  {service.title}
                </h1>
                <div className="flex items-center gap-1.5 bg-[#ff5722]/12 text-[#ff5722] px-5 py-2 rounded-full text-sm sm:text-base font-extrabold border border-[#ff5722]/25 shadow-2xs shrink-0">
                  <Star size={17} fill="currentColor" /> 4.8
                </div>
              </div>

              {/* Spec Pills */}
              <div className="flex flex-wrap gap-3 mb-8 text-xs sm:text-sm font-bold text-gray-800">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-5 py-3 rounded-full border border-white/50 shadow-2xs">
                  <Wrench size={17} className="text-[#ff5722]" /> {service.serviceMode}
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-5 py-3 rounded-full border border-white/50 shadow-2xs">
                  <Clock size={17} className="text-[#ff5722]" /> {service.estimatedDuration}
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-5 py-3 rounded-full border border-white/50 shadow-2xs">
                  <MapPin size={17} className="text-[#ff5722]" /> {service.serviceArea}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-orange-300/40 to-transparent my-8" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-3.5 tracking-tight">
                About this service
              </h3>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                {service.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          {/* Price & Booking Card */}
          <div className="bg-white/15 backdrop-blur-xs p-8 rounded-[3rem] shadow-[0_24px_55px_rgba(255,87,34,0.14),inset_0_1px_0_rgba(255,255,255,0.7)] border border-[#ff5722]/30">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ff5722]/12 border border-[#ff5722]/20 text-[#ff5722] text-xs font-extrabold uppercase tracking-wider mb-3">
              <CheckCircle2 size={13} /> Transparent Pricing
            </div>

            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Starting from
            </p>
            <div className="flex items-baseline gap-2 mb-8">
              <p className="text-5xl font-extrabold text-[#ff5722] tracking-tight">
                ${service.basePrice}
              </p>
              <span className="text-xs font-bold text-gray-600">base rate</span>
            </div>

            <button
              onClick={handleRequestClick}
              disabled={isRestrictedRole}
              className={`w-full py-4 px-6 rounded-full font-extrabold text-base sm:text-lg transition-all duration-300 ${
                isRestrictedRole
                  ? "bg-gray-300/70 text-gray-500 cursor-not-allowed border border-white/40"
                  : "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white hover:from-[#e64a19] hover:to-[#ff5722] hover:-translate-y-0.5 shadow-[0_12px_28px_rgba(255,87,34,0.38)] hover:shadow-[0_18px_36px_rgba(255,87,34,0.48)] cursor-pointer"
              }`}
            >
              {isRestrictedRole
                ? "Only customers can request"
                : "Request Repair"}
            </button>

            <p className="text-xs text-center text-gray-700 mt-5 flex items-center justify-center gap-1.5 font-bold">
              <ShieldCheck size={16} className="text-[#ff5722] shrink-0" /> Pay only after the job is done.
            </p>
          </div>

          {/* Extended Technician Card to Match Left Column Height */}
          <div className="bg-white/10 backdrop-blur-xs p-8 sm:p-9 rounded-[3rem] min-h-[420px] flex-1 flex flex-col justify-between shadow-[0_16px_40px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.65)] border border-white/50">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                  About the Technician
                </h3>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ff5722]/10 border border-[#ff5722]/20 text-[11px] font-extrabold text-[#ff5722]">
                  <Star size={12} fill="currentColor" /> 4.8 Rating
                </span>
              </div>

              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      service.technicianName
                    )}&background=ff5722&color=fff&bold=true`}
                    alt={service.technicianName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white/80 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white/95 rounded-full p-1 shadow-xs border border-[#ff5722]/20">
                    <ShieldCheck size={20} className="text-[#ff5722]" />
                  </div>
                </div>
                <div>
                  <p className="font-extrabold text-gray-900 text-xl leading-snug">
                    {service.technicianName}
                  </p>
                  <p className="text-sm text-[#ff5722] font-bold">
                    Verified Professional
                  </p>
                  {service.serviceArea && (
                    <p className="text-xs text-gray-600 font-semibold mt-1 flex items-center gap-1">
                      <MapPin size={13} className="text-[#ff5722]" /> {service.serviceArea}
                    </p>
                  )}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-orange-300/40 to-transparent" />

              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                Expert technician specialized in {service.category} repairs with over 5
                years of experience. Explore all services and work details offered by{" "}
                <span className="font-bold text-gray-900">{service.technicianName}</span>.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white/10 rounded-2xl p-3.5 border border-white/45">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">
                    Specialty
                  </p>
                  <p className="text-sm font-extrabold text-gray-900 mt-0.5 truncate">
                    {service.category}
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-3.5 border border-white/45">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">
                    Service Mode
                  </p>
                  <p className="text-sm font-extrabold text-gray-900 mt-0.5 truncate">
                    {service.serviceMode}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={technicianProfileHref}
              className="w-full mt-7 py-3.5 px-5 rounded-full font-extrabold text-sm text-[#ff5722] bg-white/15 hover:bg-[#ff5722] hover:text-white border border-[#ff5722]/35 transition-all duration-300 flex items-center justify-center gap-2 shadow-xs"
            >
              <span>View Technician & All Works</span>
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <RequestModal service={service} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}