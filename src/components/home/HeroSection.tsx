"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

const Typewriter = ({ text, delay = 100 }: { text: string; delay?: number }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      if (!isDeleting) {
        if (currentIndex < text.length) {
          setCurrentText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        } else {
          const pauseTimer = setTimeout(() => setIsDeleting(true), 2000);
          return () => clearTimeout(pauseTimer);
        }
      } else {
        if (currentIndex > 0) {
          setCurrentText((prev) => prev.slice(0, -1));
          setCurrentIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
        }
      }
    };

    const speed = isDeleting ? delay / 2 : delay;
    const timer = setTimeout(handleTyping, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting, text, delay]);

  return (
    <span className="relative">
      {currentText}
      <span className="inline-block w-[3px] sm:w-[4px] h-[1em] bg-[#ff5722] ml-1 align-middle animate-pulse" />
    </span>
  );
};

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    router.push(
      trimmed ? `/services?search=${encodeURIComponent(trimmed)}` : "/services"
    );
  };

  return (
    <section className="relative w-full min-h-[600px] sm:min-h-[680px] lg:min-h-screen flex items-center overflow-hidden">
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Hero-section-side-banner.png"
          alt="Technician repairing"
          fill
          className="object-cover object-[72%_top] sm:object-center"
          priority
        />
        {/* Full-width scrim on mobile for crisp contrast; left-to-right gradient on desktop */}
        <div className="absolute inset-0 w-full lg:w-3/4 bg-gradient-to-b from-black/75 via-black/60 to-black/80 lg:bg-gradient-to-r lg:from-black/90 lg:via-black/65 lg:to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-10 sm:pt-20 sm:pb-0">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-black/55 sm:bg-white/12 backdrop-blur-md border border-white/20 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full mb-5 sm:mb-8 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#ff5722] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-white tracking-wider uppercase">
              Verified Technicians in Dhaka
            </span>
          </div>

          {/* Main Heading with Typewriter Effect */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.12] mb-4 sm:mb-6 tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            Broken device? <br />
            <span className="text-[#ff5722]">
              <Typewriter text="Get it fixed" delay={120} />
            </span>{" "}
            <br />
            by an expert.
          </h1>

          {/* Subtitle */}
          <p className="text-gray-100 sm:text-gray-200 mb-7 sm:mb-10 max-w-md lg:max-w-lg text-sm sm:text-base lg:text-lg font-medium leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
            Book phone, laptop, and home appliance repairs. Track every step of the job
            and pay only after the work is done.
          </p>

          {/* Premium Dark Glass Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="h-12 sm:h-16 bg-[#111111]/85 sm:bg-[#111111]/75 backdrop-blur-xl border border-white/20 p-1 sm:p-1.5 rounded-full flex items-center max-w-md sm:max-w-lg w-full shadow-[0_10px_34px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-5 w-full min-w-0">
              <Search className="text-gray-300 shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What needs fixing? (e.g. iPhone Screen)"
                className="bg-transparent w-full py-1.5 sm:py-2 outline-none text-xs sm:text-sm font-bold text-white placeholder:text-gray-300/80 truncate"
              />
            </div>

            <Link
              href={
                searchQuery.trim()
                  ? `/services?search=${encodeURIComponent(searchQuery.trim())}`
                  : "/services"
              }
              className="bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] h-full px-4 sm:px-7 rounded-full font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 hover:from-[#e64a19] hover:to-[#ff5722] transition-all shadow-lg shadow-[#ff5722]/30 whitespace-nowrap"
            >
              Find Tech <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}