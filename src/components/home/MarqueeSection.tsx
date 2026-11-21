"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { fetchApi } from "@/lib/api";

const fallbackReviews = [
  {
    text: "Super fast service! My phone screen was replaced in an hour.",
    author: "Rahim K.",
    role: "Customer",
    image: "",
  },
  {
    text: "Very professional technician. Fixed my AC perfectly.",
    author: "Sara A.",
    role: "Customer",
    image: "",
  },
  {
    text: "Loved the tracking feature. I knew exactly when the tech would arrive.",
    author: "Tanvir H.",
    role: "Customer",
    image: "",
  },
  {
    text: "Transparent pricing. No hidden fees, paid after the job was done.",
    author: "Nusrat J.",
    role: "Customer",
    image: "",
  },
  {
    text: "Best platform for home appliance repair in Dhaka!",
    author: "Imran S.",
    role: "Customer",
    image: "",
  },
  {
    text: "Highly recommend FixLab for any device issues.",
    author: "Mehedi R.",
    role: "Customer",
    image: "",
  },
];

function extractImageUrl(item: any): string {
  if (!item || typeof item !== "object") return "";
  const candidates = [
    item.image,
    item.customerImage,
    item.customerPhoto,
    item.userImage,
    item.profileImage,
    item.photo,
    item.avatar,
    item.picture,
    item.photoURL,
    item.user?.image,
    item.user?.avatar,
    item.customer?.image,
    item.customer?.avatar,
  ];

  for (const val of candidates) {
    if (typeof val === "string" && val.trim()) {
      return val.trim();
    }
  }
  return "";
}

function getInitials(name?: string): string {
  const cleaned = String(name || "C").trim();
  if (!cleaned) return "C";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function CustomerAvatar({
  src,
  author,
}: {
  src: string;
  author?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const showRealImage = Boolean(src && src.trim()) && !imgFailed;

  return (
    <div className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-full p-[1.5px] bg-gradient-to-tr from-[#ff5722] to-[#ff8a65] shrink-0 shadow-xs">
      {showRealImage ? (
        <img
          src={src.trim()}
          alt={author || "Customer"}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="w-full h-full rounded-full object-cover object-top border border-white bg-white"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#ff5722] to-[#e64a19] text-white border border-white flex items-center justify-center text-[11px] sm:text-xs font-extrabold tracking-tight select-none">
          {getInitials(author)}
        </div>
      )}

      <span className="hidden sm:flex absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#ff5722] text-white items-center justify-center border-2 border-white shadow-2xs">
        <Quote size={7} fill="currentColor" />
      </span>
    </div>
  );
}

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
            author:
              r.author ||
              r.customerName ||
              r.name ||
              r.user?.name ||
              "Verified Customer",
            role: r.role || "Customer",
            image: extractImageUrl(r),
          }));
          setReviews(formatted);
        }
      })
      .catch(() => {
        console.log("No real reviews yet, using fallback");
      });
  }, []);

  const renderReviewCards = (setPrefix: string) => (
    <div className="flex gap-2.5 sm:gap-5 px-2 sm:px-3">
      {reviews.map((review, idx) => (
        <div
          key={`${setPrefix}-${idx}`}
          className="group relative flex items-center gap-2.5 sm:gap-4 bg-white/15 hover:bg-white/22 backdrop-blur-xs border border-white/55 hover:border-[#ff5722]/40 px-3 py-2 sm:px-5 sm:py-3.5 rounded-2xl sm:rounded-[1.75rem] shadow-[0_8px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.65)] hover:shadow-[0_14px_30px_rgba(255,87,34,0.1)] transition-all duration-300 w-[225px] sm:w-[365px] shrink-0 overflow-hidden"
        >
          {/* Subdued Hover Shine */}
          <div className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/8 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.1s] ease-in-out pointer-events-none" />

          {/* Customer Image Avatar */}
          <CustomerAvatar src={review.image || ""} author={review.author} />

          {/* Review Text & Meta */}
          <div className="min-w-0 flex-1 relative z-20">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <p className="text-[10px] sm:text-xs font-extrabold text-gray-900 truncate">
                {review.author}{" "}
                <span className="hidden sm:inline text-[#ff5722] font-bold">
                  - {review.role}
                </span>
              </p>
              <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                <Star size={10} fill="currentColor" />
                <span className="text-[9px] sm:text-[11px] font-extrabold text-gray-700">
                  {review.rating ?? "5.0"}
                </span>
              </div>
            </div>

            <p className="text-[10px] sm:text-xs font-semibold text-gray-700 line-clamp-1 mb-1 sm:mb-1.5">
              “{review.text}”
            </p>

            {/* Sliding Orange Accent Line */}
            <div className="w-full h-[1.5px] sm:h-[2px] bg-black/5 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-[#ff5722] transition-all duration-300 group-hover:w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-6 sm:py-10 overflow-hidden relative w-full border-y border-white/40 bg-white/10 backdrop-blur-xs">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[560px] h-[110px] sm:h-[140px] bg-[#ff5722]/10 blur-[110px] rounded-full pointer-events-none -z-10" />

      {/* Left & Right Soft Edge Fades */}
      <div className="absolute top-0 left-0 w-7 sm:w-28 h-full bg-gradient-to-r from-[#f1f3f6] to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-7 sm:w-28 h-full bg-gradient-to-l from-[#f1f3f6] to-transparent z-20 pointer-events-none" />

      <div className="flex w-max animate-marquee [animation-duration:12s] sm:[animation-duration:17s] hover:[animation-play-state:paused]">
        {renderReviewCards("set-1")}
        {renderReviewCards("set-2")}
      </div>
    </section>
  );
}