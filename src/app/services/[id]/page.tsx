"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, MapPin, ShieldCheck, Wrench, Star, Loader2 } from "lucide-react";
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
      return; // Disabled
    } else {
      setIsModalOpen(true);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-fixlab-green" size={48} /></div>;
  if (!service) return <div className="min-h-screen flex items-center justify-center text-fixlab-gray">Service not found.</div>;

  return (
    <div className="w-full bg-[#F8F9FA] min-h-screen pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-fixlab-gray hover:text-fixlab-green transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Services
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative w-full h-[300px] sm:h-[450px] rounded-3xl overflow-hidden shadow-lg">
            <Image src={service.image} alt={service.title} fill sizes="(max-width: 768px) 100vw, 66vw" className="object-cover" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-fixlab-green">
              {service.category}
            </div>
          </div>

          <div className="glass-card bg-white/60 p-6 sm:p-8 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-fixlab-charcoal">{service.title}</h1>
              <div className="flex items-center gap-1 bg-fixlab-mint/30 text-fixlab-green px-3 py-1 rounded-full text-sm font-bold">
                <Star size={16} fill="currentColor" /> 4.8
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6 text-sm font-medium text-fixlab-gray">
              <div className="flex items-center gap-2"><Wrench size={18} /> {service.serviceMode}</div>
              <div className="flex items-center gap-2"><Clock size={18} /> {service.estimatedDuration}</div>
              <div className="flex items-center gap-2"><MapPin size={18} /> {service.serviceArea}</div>
            </div>

            <hr className="border-gray-100 my-6" />

            <h3 className="text-lg font-bold text-fixlab-charcoal mb-3">About this service</h3>
            <p className="text-fixlab-gray leading-relaxed">{service.description}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="glass-card bg-white/80 p-6 rounded-3xl sticky top-28 shadow-xl border border-white">
            <p className="text-sm text-fixlab-gray mb-1">Starting from</p>
            <p className="text-4xl font-extrabold text-fixlab-green mb-6">${service.basePrice}</p>
            
            <button
              onClick={handleRequestClick}
              disabled={session?.user?.role === "technician" || session?.user?.role === "admin"}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                session?.user?.role === "technician" || session?.user?.role === "admin"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-fixlab-green text-white hover:bg-opacity-90 hover:-translate-y-0.5"
              }`}
            >
              {session?.user?.role === "technician" || session?.user?.role === "admin" 
                ? "Only customers can request" 
                : "Request Repair"}
            </button>
            
            <p className="text-xs text-center text-fixlab-gray mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={14} /> Pay only after the job is done.
            </p>
          </div>

          <div className="glass-card bg-white/60 p-6 rounded-3xl">
            <h3 className="text-sm font-bold text-fixlab-gray uppercase tracking-wider mb-4">About the Technician</h3>
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(service.technicianName)}&background=1A432A&color=fff&bold=true`} 
                alt={service.technicianName} 
                className="w-14 h-14 rounded-full object-cover border-2 border-fixlab-mint"
              />
              <div>
                <p className="font-bold text-fixlab-charcoal">{service.technicianName}</p>
                <p className="text-xs text-fixlab-gray">Verified Professional</p>
              </div>
            </div>
            <p className="text-sm text-fixlab-gray">Expert technician specialized in {service.category} repairs.</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <RequestModal service={service} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}