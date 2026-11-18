"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, MapPin, ShieldCheck, Wrench, Star } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import RequestModal from "@/components/forms/RequestModal";

// ডামি ডেটা (পরে API থেকে আসবে)
const serviceData = {
  _id: "1",
  title: "iPhone Screen Replacement",
  category: "Smartphone",
  description: "Cracked screen? We offer premium original quality screen replacement for all iPhone models. Our verified technicians will come to your home and fix it within 1 hour. Includes 3 months warranty.",
  image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=1200",
  basePrice: 49,
  estimatedDuration: "1-2 hours",
  serviceMode: "Home Visit",
  serviceArea: "Dhanmondi, Dhaka",
  technicianName: "Rahim Uddin",
  technicianEmail: "rahim@example.com",
  technicianImage: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200",
  technicianBio: "Expert mobile repair technician with 5+ years of experience in Apple products.",
  rating: 4.8,
  reviews: 124
};

export default function ServiceDetailsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestClick = () => {
    if (!session) {
      router.push(`/sign-in?redirect=/services/${serviceData._id}`);
    } else if (session.user.role === "technician" || session.user.role === "admin") {
      return; // Disabled for them
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="w-full bg-[#F8F9FA] min-h-screen pb-20">
      
      {/* Top Navigation */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-fixlab-gray hover:text-fixlab-green transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Services
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Image & Description) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="relative w-full h-[300px] sm:h-[450px] rounded-3xl overflow-hidden shadow-lg">
            <Image
              src={serviceData.image}
              alt={serviceData.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-fixlab-green">
              {serviceData.category}
            </div>
          </div>

          {/* Service Info */}
          <div className="glass-card bg-white/60 p-6 sm:p-8 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-fixlab-charcoal">{serviceData.title}</h1>
              <div className="flex items-center gap-1 bg-fixlab-mint/30 text-fixlab-green px-3 py-1 rounded-full text-sm font-bold">
                <Star size={16} fill="currentColor" /> {serviceData.rating}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6 text-sm font-medium text-fixlab-gray">
              <div className="flex items-center gap-2"><Wrench size={18} /> {serviceData.serviceMode}</div>
              <div className="flex items-center gap-2"><Clock size={18} /> {serviceData.estimatedDuration}</div>
              <div className="flex items-center gap-2"><MapPin size={18} /> {serviceData.serviceArea}</div>
            </div>

            <hr className="border-gray-100 my-6" />

            <h3 className="text-lg font-bold text-fixlab-charcoal mb-3">About this service</h3>
            <p className="text-fixlab-gray leading-relaxed">{serviceData.description}</p>
          </div>
        </div>

        {/* Right Column (Booking Card & Technician Info) */}
        <div className="space-y-6">
          
          {/* Price & Booking Card */}
          <div className="glass-card bg-white/80 p-6 rounded-3xl sticky top-28 shadow-xl border border-white">
            <p className="text-sm text-fixlab-gray mb-1">Starting from</p>
            <p className="text-4xl font-extrabold text-fixlab-green mb-6">${serviceData.basePrice}</p>
            
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

          {/* Technician Card */}
          <div className="glass-card bg-white/60 p-6 rounded-3xl">
            <h3 className="text-sm font-bold text-fixlab-gray uppercase tracking-wider mb-4">About the Technician</h3>
            <div className="flex items-center gap-4 mb-4">
              <Image 
                src={serviceData.technicianImage} 
                alt={serviceData.technicianName} 
                width={60} height={60} 
                className="rounded-full object-cover border-2 border-fixlab-mint"
              />
              <div>
                <p className="font-bold text-fixlab-charcoal">{serviceData.technicianName}</p>
                <p className="text-xs text-fixlab-gray">Verified Professional</p>
              </div>
            </div>
            <p className="text-sm text-fixlab-gray">{serviceData.technicianBio}</p>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {isModalOpen && (
        <RequestModal 
          service={serviceData} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}