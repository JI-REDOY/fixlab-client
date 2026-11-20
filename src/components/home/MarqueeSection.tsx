"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { fetchApi } from "@/lib/api";

const fallbackReviews = [
  {
    text: "Super fast service! My phone screen was replaced in an hour.",
    author: "Rahim K.",
    role: "Customer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    text: "Very professional technician. Fixed my AC perfectly.",
    author: "Sara A.",
    role: "Customer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    text: "Loved the tracking feature. I knew exactly when the tech would arrive.",
    author: "Tanvir H.",
    role: "Customer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    text: "Transparent pricing. No hidden fees, paid after the job was done.",
    author: "Nusrat J.",
    role: "Customer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  },
  {
    text: "Best platform for home appliance repair in Dhaka!",
    author: "Imran S.",
    role: "Customer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
  },
  {
    text: "Highly recommend FixLab for any device issues.",
    author: "Mehedi R.",
    role: "Customer",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
  },
];

export default function MarqueeSection() {
  const [reviews, setReviews] = useState<any[]>(fallbackReviews);

  useEffect(() => {
    fetchApi("/api/public/reviews")
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.reviews)
          ? data.reviews
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (list.length > 0) {
          const formatted = list.map((r: any) => ({
            ...r,
            author: r.author || r.name || "Verified Customer",
            role: r.role || "Customer",
            image: r.image || r.avatar || r.photo || "",
          }));
          setReviews(formatted);
        }
      })
      .catch(() => {
        console.log("No real reviews yet, using fallback");
      });
  }, []);

  const renderReviewCards = (setPrefix: string) => (
    <div className="flex gap-6 px-3">
      {reviews.map((review, idx) => {
        const avatarSrc =
          review.image ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            review.author || "Customer"
          )}&background=ff5722&color=fff&bold=true`;

        return (
          <div
            key={`${setPrefix}-${idx}`}
            className="group relative flex items-center gap-4 bg-white/15 hover:bg-white/22 backdrop-blur-xs border border-white/55 hover:border-[#ff5722]/40 px-5 py-4 rounded-[1.75rem] shadow-[0_10px_24px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.65)] hover:shadow-[0_14px_30px_rgba(255,87,34,0.1)] transition-all duration-300 w-[370px] shrink-0 overflow-hidden"
          >
            {/* Subdued Hover Shine */}
            <div className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/8 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.1s] ease-in-out pointer-events-none" />

            {/* Customer Image Avatar */}
            <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#ff5722] to-[#ff8a65] shrink-0 shadow-xs">
              <img
                src={avatarSrc}
                alt={review.author || "Customer"}
                className="w-full h-full rounded-full object-cover border-2 border-white bg-white"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#ff5722] text-white flex items-center justify-center border-2 border-white shadow-2xs">
                <Quote size={10} fill="currentColor" />
              </span>
            </div>

            {/* Review Text & Meta */}
            <div className="min-w-0 flex-1 relative z-20">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-xs font-extrabold text-gray-900 truncate">
                  {review.author}{" "}
                  <span className="text-[#ff5722] font-bold">
                    • {review.role}
                  </span>
                </p>
                <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                  <Star size={12} fill="currentColor" />
                  <span className="text-[11px] font-extrabold text-gray-700">
                    {review.rating ?? "5.0"}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-gray-700 line-clamp-1 mb-2">
                “{review.text}”
              </p>

              {/* Sliding Orange Accent Line */}
              <div className="w-full h-[2px] bg-black/5 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-[#ff5722] transition-all duration-300 group-hover:w-full" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="py-12 overflow-hidden relative w-full border-y border-white/40 bg-white/10 backdrop-blur-xs">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[140px] bg-[#ff5722]/10 blur-[110px] rounded-full pointer-events-none -z-10" />

      {/* Left & Right Soft Edge Fades */}
      <div className="absolute top-0 left-0 w-24 sm:w-32 h-full bg-gradient-to-r from-[#f1f3f6] to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-full bg-gradient-to-l from-[#f1f3f6] to-transparent z-20 pointer-events-none" />

      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {renderReviewCards("set-1")}
        {renderReviewCards("set-2")}
      </div>
    </section>
  );
}