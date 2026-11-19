"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8F9FA]">
      <AlertTriangle size={80} className="text-red-400 mb-6" />
      <h1 className="text-3xl font-extrabold text-fixlab-charcoal mb-2">Oops! Something went wrong.</h1>
      <p className="text-fixlab-gray mb-8">We couldn't load this page. Please try again.</p>
      <button onClick={() => reset()} className="px-8 py-3 bg-fixlab-green text-white font-bold rounded-full hover:bg-opacity-90 transition-all">
        Try Again
      </button>
    </div>
  );
}