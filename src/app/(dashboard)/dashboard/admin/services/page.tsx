"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

const initialServices = [
  { _id: "s1", title: "iPhone Screen Replacement", technician: "Rahim Uddin", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=200", status: "pending" },
  { _id: "s2", title: "MacBook Pro Battery Repair", technician: "Karim Ahmed", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=200", status: "approved" },
  { _id: "s3", title: "AC Servicing", technician: "Rahim Uddin", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200", status: "rejected" },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [filter, setFilter] = useState("all");

  const updateStatus = (id: string, newStatus: string) => {
    setServices(services.map(s => s._id === id ? { ...s, status: newStatus } : s));
    toast.success(`Service ${newStatus}`);
  };

  const filteredServices = filter === "all" ? services : services.filter(s => s.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Service Approval</h1>
          <p className="text-fixlab-gray text-sm">Review and moderate services listed by technicians.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${
                filter === s ? "bg-fixlab-green text-white" : "text-fixlab-gray hover:bg-fixlab-cream"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fixlab-cream border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Technician</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredServices.map((service) => (
                <tr key={service._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <Image src={service.image} alt={service.title} fill sizes="48px" className="object-cover" />
                      </div>
                      <p className="font-bold text-sm text-fixlab-charcoal">{service.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{service.technician}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                      service.status === "approved" ? "bg-green-100 text-green-700" :
                      service.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    }`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {service.status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(service._id, "approved")} className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors" title="Approve"><Check size={16} /></button>
                        <button onClick={() => updateStatus(service._id, "rejected")} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Reject"><X size={16} /></button>
                      </>
                    )}
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