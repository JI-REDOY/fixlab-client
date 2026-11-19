import Link from "next/link";
import { Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8F9FA]">
      <Wrench size={80} className="text-fixlab-gray mb-6 opacity-20" />
      <h1 className="text-4xl font-extrabold text-fixlab-charcoal mb-2">404 Not Found</h1>
      <p className="text-fixlab-gray mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="px-8 py-3 bg-fixlab-green text-white font-bold rounded-full hover:bg-opacity-90 transition-all">
        Back to Home
      </Link>
    </div>
  );
}