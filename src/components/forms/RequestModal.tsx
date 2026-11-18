"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { fetchApi } from "@/lib/api"; // API হেল্পার

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
      // সার্ভারে ডেটা পাঠানো
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
      
      // My Bookings পেজে রিডাইরেক্ট করা
      window.location.href = "/dashboard/customer/bookings"; 
    } catch (err: any) {
      toast.error(err.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-fixlab-cream">
          <div>
            <h2 className="text-xl font-bold text-fixlab-charcoal">Request Repair</h2>
            <p className="text-sm text-fixlab-gray">{service.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Read Only Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-fixlab-gray mb-1 block">Name</label>
              <input type="text" readOnly value={session?.user?.name || ""} className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm text-fixlab-gray cursor-not-allowed" />
            </div>
            <div>
              <label className="text-xs font-bold text-fixlab-gray mb-1 block">Email</label>
              <input type="email" readOnly value={session?.user?.email || ""} className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm text-fixlab-gray cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-fixlab-gray mb-1 block">Phone</label>
            <input
              type="text"
              placeholder="+880 1XXX XXXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-3 bg-fixlab-cream rounded-xl text-sm outline-none border-2 transition-colors ${errors.phone ? "border-red-400" : "border-transparent focus:border-fixlab-green"}`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-xs font-bold text-fixlab-gray mb-1 block">Address</label>
            <input
              type="text"
              placeholder="Full address for service"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`w-full px-4 py-3 bg-fixlab-cream rounded-xl text-sm outline-none border-2 transition-colors ${errors.address ? "border-red-400" : "border-transparent focus:border-fixlab-green"}`}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="text-xs font-bold text-fixlab-gray mb-1 block">Preferred Date</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className={`w-full px-4 py-3 bg-fixlab-cream rounded-xl text-sm outline-none border-2 transition-colors ${errors.preferredDate ? "border-red-400" : "border-transparent focus:border-fixlab-green"}`}
            />
            {errors.preferredDate && <p className="text-xs text-red-500 mt-1">{errors.preferredDate}</p>}
          </div>

          <div>
            <label className="text-xs font-bold text-fixlab-gray mb-1 block">Problem Description</label>
            <textarea
              rows={3}
              placeholder="Describe what's wrong with your device... (min 20 chars)"
              value={formData.problemDescription}
              onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
              className={`w-full px-4 py-3 bg-fixlab-cream rounded-xl text-sm outline-none border-2 transition-colors resize-none ${errors.problemDescription ? "border-red-400" : "border-transparent focus:border-fixlab-green"}`}
            />
            {errors.problemDescription && <p className="text-xs text-red-500 mt-1">{errors.problemDescription}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-fixlab-green text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? "Sending Request..." : "Send Request"}
          </button>
        </form>
      </div>
    </div>
  );
}