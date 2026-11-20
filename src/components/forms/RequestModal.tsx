"use client";

import { useState } from "react";
import { X, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { fetchApi } from "@/lib/api";

interface RequestModalProps {
  service: any;
  onClose: () => void;
}

export default function RequestModal({ service, onClose }: RequestModalProps) {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    preferredDate: "",
    problemDescription: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    
    if (!formData.preferredDate) {
      newErrors.preferredDate = "Date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(formData.preferredDate) < today) {
        newErrors.preferredDate = "Date must be today or in the future";
      }
    }

    if (formData.problemDescription.length < 20) {
      newErrors.problemDescription = "Description must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      await fetchApi("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          serviceId: service._id,
          customerPhone: formData.phone,
          address: formData.address,
          preferredDate: formData.preferredDate,
          problemDescription: formData.problemDescription,
        }),
      });

      toast.success("Repair request sent successfully!");
      onClose();
      window.location.href = "/dashboard/customer/bookings";
    } catch (err: any) {
      toast.error(err.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in">
      {/* প্রিমিয়াম গ্লাসি মডাল কন্টেইনার */}
      <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] w-full max-w-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/60 animate-in zoom-in-95 relative">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff5722]/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/40 bg-white/20 relative z-10">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Request Repair</h2>
            <p className="text-sm font-bold text-[#ff5722]">{service.title}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/50 hover:bg-white text-gray-500 hover:text-black rounded-full transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 relative z-10">
          
          {/* Read Only Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">Name</label>
              <input 
                type="text" 
                readOnly 
                value={session?.user?.name || ""} 
                className="w-full px-4 py-3 bg-gray-100/80 rounded-xl text-sm font-bold text-gray-600 cursor-not-allowed border border-gray-200" 
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">Email</label>
              <input 
                type="email" 
                readOnly 
                value={session?.user?.email || ""} 
                className="w-full px-4 py-3 bg-gray-100/80 rounded-xl text-sm font-bold text-gray-600 cursor-not-allowed border border-gray-200" 
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">Phone</label>
            <input
              type="text"
              placeholder="+880 1XXX XXXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-3 bg-white/50 rounded-xl text-sm font-bold text-gray-800 outline-none border-2 transition-all shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)] ${
                errors.phone ? "border-red-400" : "border-white/60 focus:border-[#ff5722]"
              }`}
            />
            {errors.phone && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">Address</label>
            <input
              type="text"
              placeholder="Full address for service"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`w-full px-4 py-3 bg-white/50 rounded-xl text-sm font-bold text-gray-800 outline-none border-2 transition-all shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)] ${
                errors.address ? "border-red-400" : "border-white/60 focus:border-[#ff5722]"
              }`}
            />
            {errors.address && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.address}</p>}
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">Preferred Date</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className={`w-full px-4 py-3 bg-white/50 rounded-xl text-sm font-bold text-gray-800 outline-none border-2 transition-all shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)] ${
                errors.preferredDate ? "border-red-400" : "border-white/60 focus:border-[#ff5722]"
              }`}
            />
            {errors.preferredDate && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.preferredDate}</p>}
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">Problem Description</label>
            <textarea
              rows={3}
              placeholder="Describe what's wrong with your device... (min 20 chars)"
              value={formData.problemDescription}
              onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
              className={`w-full px-4 py-3 bg-white/50 rounded-xl text-sm font-bold text-gray-800 outline-none border-2 transition-all resize-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)] ${
                errors.problemDescription ? "border-red-400" : "border-white/60 focus:border-[#ff5722]"
              }`}
            />
            {errors.problemDescription && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.problemDescription}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#ff5722] text-white rounded-full font-extrabold text-lg hover:bg-black transition-all shadow-[0_10px_20px_rgba(255,87,34,0.3)] hover:shadow-[0_15px_25px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 mt-4 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? "Sending Request..." : "Send Request"}
          </button>
        </form>
      </div>
    </div>
  );
}