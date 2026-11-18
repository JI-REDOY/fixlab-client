import ServiceCard from "../cards/ServiceCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const dummyServices = [
  { _id: "1", title: "iPhone Screen Replacement", category: "Smartphone", image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800", basePrice: 49, serviceMode: "Home Visit", serviceArea: "Dhanmondi, Dhaka", technicianName: "Rahim Uddin" },
  { _id: "2", title: "MacBook Pro Battery Repair", category: "Laptop & PC", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800", basePrice: 89, serviceMode: "Shop Drop-off", serviceArea: "Mirpur, Dhaka", technicianName: "Karim Ahmed" },
  { _id: "3", title: "AC Servicing & Gas Refill", category: "AC", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800", basePrice: 35, serviceMode: "Home Visit", serviceArea: "Uttara, Dhaka", technicianName: "Rahim Uddin" },
  { _id: "4", title: "Refrigerator Cooling Issue", category: "Refrigerator", image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=800", basePrice: 55, serviceMode: "Home Visit", serviceArea: "Gulshan, Dhaka", technicianName: "Karim Ahmed" },
  { _id: "5", title: "Washing Machine Motor Fix", category: "Washing Machine", image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=800", basePrice: 40, serviceMode: "Shop Drop-off", serviceArea: "Banani, Dhaka", technicianName: "Jamil Khan" },
  { _id: "6", title: "Smart TV Screen Repair", category: "TV", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800", basePrice: 75, serviceMode: "Home Visit", serviceArea: "Mohakhali, Dhaka", technicianName: "Rahim Uddin" },
];

export default function FeaturedServices() {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-fixlab-charcoal mb-2">Featured Services</h2>
          <p className="text-fixlab-gray">Our top-rated repair services by verified technicians.</p>
        </div>
        <Link href="/services" className="hidden sm:flex items-center gap-2 text-fixlab-green font-bold hover:underline">
          View All <ArrowRight size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyServices.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
      
      <div className="mt-8 flex justify-center sm:hidden">
        <Link href="/services" className="flex items-center gap-2 text-fixlab-green font-bold hover:underline">
          View All Services <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}