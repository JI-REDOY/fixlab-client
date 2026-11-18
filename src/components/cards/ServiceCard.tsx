import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Wrench } from "lucide-react";

interface ServiceCardProps {
  service: {
    _id: string;
    title: string;
    category: string;
    image: string;
    basePrice: number;
    serviceMode: string;
    serviceArea: string;
    technicianName: string;
  };
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group glass-card rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/60">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={service.image || "https://images.unsplash.com/photo-1581092921461-7031e4bf0e1a?q=80&w=800&auto=format&fit=crop"}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-fixlab-green uppercase tracking-wide">
          {service.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-fixlab-charcoal line-clamp-1">{service.title}</h3>
        </div>
        
        <p className="text-sm text-fixlab-gray mb-4 line-clamp-1">by {service.technicianName}</p>

        <div className="flex flex-wrap gap-3 text-xs font-medium text-fixlab-gray mb-6">
          <div className="flex items-center gap-1">
            <Wrench size={14} /> {service.serviceMode}
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} /> {service.serviceArea}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-fixlab-gray">Starting from</p>
            <p className="text-lg font-extrabold text-fixlab-green">${service.basePrice}</p>
          </div>
          <Link
            href={`/services/${service._id}`}
            className="flex items-center gap-2 bg-fixlab-cream border border-gray-200 text-fixlab-charcoal px-4 py-2 rounded-full text-sm font-bold transition-all group-hover:bg-fixlab-green group-hover:text-white group-hover:border-fixlab-green"
          >
            Details <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}