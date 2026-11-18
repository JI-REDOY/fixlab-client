import Link from "next/link";
import { Smartphone, Laptop, Wind, Refrigerator, Tv, WashingMachine, Zap } from "lucide-react";

const categories = [
  { name: "Smartphone", icon: Smartphone },
  { name: "Laptop & PC", icon: Laptop },
  { name: "AC", icon: Wind },
  { name: "Refrigerator", icon: Refrigerator },
  { name: "TV", icon: Tv },
  { name: "Washing Machine", icon: WashingMachine },
  { name: "Electrical", icon: Zap },
];

export default function PopularCategories() {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-fixlab-charcoal mb-4">Popular Categories</h2>
        <p className="text-fixlab-gray">Explore our most booked repair categories.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={`/services?category=${encodeURIComponent(cat.name)}`}
            className="group flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-fixlab-green/30 hover:-translate-y-1"
          >
            <div className="w-16 h-16 rounded-2xl bg-fixlab-cream flex items-center justify-center mb-4 transition-colors group-hover:bg-fixlab-mint/30">
              <cat.icon size={32} className="text-fixlab-green" />
            </div>
            <span className="font-bold text-fixlab-charcoal text-center">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}