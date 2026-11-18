"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const initialServices = [
  { _id: "1", title: "iPhone Screen Replacement", category: "Smartphone", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=200", basePrice: 49, status: "approved", isAvailable: true },
  { _id: "2", title: "MacBook Pro Battery Repair", category: "Laptop & PC", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=200", basePrice: 89, status: "pending", isAvailable: true },
];

export default function MyServicesPage() {
  const [services, setServices] = useState(initialServices);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter((s) => s._id !== id));
      toast.success("Service deleted successfully");
    }
  };

  const toggleAvailability = (id: string) => {
    setServices(services.map((s) => 
      s._id === id ? { ...s, isAvailable: !s.isAvailable } : s
    ));
    toast.success("Availability updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-fixlab-charcoal">My Services</h1>
          <p className="text-fixlab-gray text-sm">Manage all your listed services.</p>
        </div>
        <Link href="/dashboard/technician/add-service" className="px-5 py-2.5 bg-fixlab-green text-white text-sm font-bold rounded-xl hover:bg-opacity-90 transition-all">
          + Add New
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fixlab-cream border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Available</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <Image src={service.image} alt={service.title} fill sizes="48px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-fixlab-charcoal line-clamp-1">{service.title}</p>
                        <p className="text-xs text-fixlab-gray">{service.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-fixlab-green">${service.basePrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                      service.status === "approved" ? "bg-green-100 text-green-700" :
                      service.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    }`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleAvailability(service._id)}
                      className={`w-10 h-6 rounded-full relative transition-colors ${service.isAvailable ? 'bg-fixlab-green' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${service.isAvailable ? 'left-5' : 'left-1'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => toast.info("Edit modal coming soon")} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(service._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}