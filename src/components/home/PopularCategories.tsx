"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Smartphone,
  Laptop,
  Wind,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
  ArrowUpRight,
  LayoutGrid,
  Sparkles,
} from "lucide-react";

const categoryData = [
  {
    name: "Smartphone",
    title: "Smartphone Repair",
    tag: "Screen & Battery",
    icon: Smartphone,
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Laptop & PC",
    title: "Laptop & PC",
    tag: "Hardware & OS",
    icon: Laptop,
    image:
      "https://images.unsplash.com/photo-1588702547919-26089e690ecc?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "AC",
    title: "AC Servicing",
    tag: "Cooling & Gas",
    icon: Wind,
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Refrigerator",
    title: "Fridge Repair",
    tag: "Compressor & Seal",
    icon: Refrigerator,
    image:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "TV",
    title: "TV Screen Repair",
    tag: "Display & Panel",
    icon: Tv,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Washing Machine",
    title: "Washing Machine",
    tag: "Motor & Drum",
    icon: WashingMachine,
    image:
      "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Electrical",
    title: "Electrical Wiring",
    tag: "Safety & Circuit",
    icon: Zap,
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "All",
    title: "All Services",
    tag: "Full Catalog",
    icon: LayoutGrid,
    image: "",
  },
];

export default function PopularCategories() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[340px] bg-[#ff5722]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-[#ff5722]/10 border border-[#ff5722]/20 text-[#ff5722] font-extrabold tracking-wider uppercase text-xs mb-4 shadow-2xs">
            <Sparkles size={13} /> Categories
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
            Popular <span className="text-[#ff5722]">Categories</span>
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
            Explore our most booked repair categories with trusted specialists.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categoryData.map((category, index) => {
            const IconComponent = category.icon;

            if (category.name === "All") {
              return (
                <Link
                  key={category.name}
                  href="/services"
                  className={`group relative h-[320px] rounded-[2.25rem] overflow-hidden flex flex-col items-center justify-center bg-white/12 backdrop-blur-xs border border-white/55 shadow-[0_8px_24px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.65)] transition-all duration-400 hover:-translate-y-1.5 hover:bg-white/18 hover:shadow-[0_14px_30px_rgba(255,87,34,0.1)] hover:border-[#ff5722]/40 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="w-20 h-20 rounded-2xl bg-[#ff5722]/12 border border-[#ff5722]/25 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#ff5722] group-hover:border-[#ff5722]">
                    <IconComponent className="h-9 w-9 text-[#ff5722] group-hover:text-white transition-colors duration-300" />
                  </div>

                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ff5722] mb-1">
                    {category.tag}
                  </span>
                  <h3 className="font-extrabold text-2xl text-gray-900 mb-2 tracking-tight">
                    {category.title}
                  </h3>

                  <div className="relative inline-flex items-center text-sm text-gray-700 font-bold group-hover:text-[#ff5722] transition-colors pb-1">
                    <span>View All</span>
                    <ArrowUpRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#ff5722] rounded-full transition-all duration-300 group-hover:w-full" />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={category.name}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className={`group relative h-[320px] rounded-[2.25rem] overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(255,87,34,0.14)] ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />

                {/* Premium Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/90 transition-colors duration-400" />

                {/* Subtle Glass Border */}
                <div className="absolute inset-0 rounded-[2.25rem] border border-white/25 group-hover:border-[#ff5722]/50 transition-colors duration-300 z-30 pointer-events-none" />

                {/* Subdued Hover Shine */}
                <div className="absolute inset-0 z-40 bg-gradient-to-tr from-transparent via-white/8 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.1s] ease-in-out pointer-events-none" />

                {/* Card Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/12 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white/90 tracking-wide">
                      {category.tag}
                    </span>

                    <div className="p-2.5 rounded-xl bg-white/12 backdrop-blur-md border border-white/25 shadow-xs transition-all duration-300 group-hover:bg-[#ff5722] group-hover:border-[#ff5722]">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xl text-white mb-2 tracking-tight group-hover:text-[#ff8a65] transition-colors">
                      {category.title}
                    </h3>
                    <div className="relative inline-flex items-center text-sm text-gray-200 font-semibold group-hover:text-white transition-colors pb-1">
                      <span>Explore</span>
                      <ArrowUpRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#ff5722] rounded-full transition-all duration-300 group-hover:w-full" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}