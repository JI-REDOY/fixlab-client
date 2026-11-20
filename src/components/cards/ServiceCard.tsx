"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Wrench, ArrowUpRight, ShieldCheck } from "lucide-react";

export default function ServiceCard({ service }: { service: any }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <Link 
      ref={cardRef}
      href={`/services/${service._id}`} 
      // এখানে transition-all duration-700 এবং opacity/translate যোগ করা হয়েছে
      className={`group relative flex flex-col h-full rounded-2xl overflow-hidden border border-white/60 hover:border-[#ff5722]/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(255,87,34,0.15)] transition-all duration-700 ease-out hover:-translate-y-2 bg-white/5 backdrop-blur-[1px] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    >
      {/* ১. Shine Effect (আলোর ঝলক) */}
      <div className="absolute inset-0 z-50 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.2s] ease-in-out pointer-events-none" />

      {/* ২. Orange Dot (Nav Icon Style) */}
      <div className="absolute top-4 right-4 z-30 w-3 h-3 bg-[#ff5722] rounded-full shadow-[0_0_10px_rgba(255,87,34,0.8)] border border-white/50 group-hover:scale-150 transition-transform duration-500"></div>

      {/* Image Container */}
      <div className="relative h-52 w-full shrink-0 overflow-hidden bg-black/10">
        <Image
          src={service.image || "/placeholder.png"}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-sm uppercase tracking-wider group-hover:bg-[#ff5722] group-hover:text-white transition-colors duration-300">
          {service.category}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 flex-grow p-5 flex flex-col bg-white/5 transition-colors duration-500">
        
        {/* Title */}
        <h3 className="text-xl font-bold mb-2 line-clamp-1 text-gray-900 group-hover:text-[#ff5722] transition-colors pr-6">
          {service.title}
        </h3>
        
        {/* Technician Info */}
        <div className="flex items-center text-gray-700 text-sm mb-3">
          <ShieldCheck className="h-4 w-4 mr-1.5 text-[#ff5722] shrink-0" /> 
          <span className="truncate">By <span className="font-bold text-gray-900">{service.technicianName}</span></span>
        </div>

        {/* Tags (Mode & Area) */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
          <div className="flex items-center text-xs text-gray-700 font-medium">
            <Wrench className="h-3.5 w-3.5 mr-1.5 text-[#ff5722] shrink-0" />
            {service.serviceMode}
          </div>
          <div className="flex items-center text-xs text-gray-700 font-medium">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-[#ff5722] shrink-0" />
            {service.serviceArea}
          </div>
        </div>
        
        {/* Divider & Price/Action */}
        <div className="mt-auto">
          <div className="w-full h-px bg-gray-300/60 mb-4 group-hover:bg-[#ff5722]/20 transition-colors duration-500" />
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-0.5">Starting at</span>
              <span className="text-2xl font-extrabold text-gray-900">${service.basePrice}</span>
            </div>
            
            {/* Arrow Button (Premium Hover) */}
            <div className="w-10 h-10 rounded-full bg-[#ff5722] border border-[#ff5722] flex items-center justify-center text-white transition-all duration-500 group-hover:bg-black group-hover:border-black shadow-md shadow-[#ff5722]/30 group-hover:shadow-none group-hover:-rotate-45">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}