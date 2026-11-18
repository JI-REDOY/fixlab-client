"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { UploadCloud } from "lucide-react";

export default function AddServicePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Smartphone",
    description: "",
    basePrice: "",
    estimatedDuration: "",
    serviceMode: "Home Visit",
    serviceArea: "",
    image: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      // TODO: ImgBB API Integration
      setFormData({ ...formData, image: "https://images.unsplash.com/photo-1581092921461-7031e4bf0e1a?q=80&w=800" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: API call to save service
    setTimeout(() => {
      setLoading(false);
      toast.success("Service added successfully! Waiting for admin approval.");
      router.push("/dashboard/technician/my-services");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Add a New Service</h1>
        <p className="text-fixlab-gray text-sm">Fill out the details to list your repair service.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-5">
        
        {/* Image Upload */}
        <div>
          <label className="text-sm font-bold text-fixlab-charcoal mb-2 block">Service Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-32 object-contain rounded-xl" />
            ) : (
              <>
                <UploadCloud size={40} className="text-fixlab-gray mb-2" />
                <p className="text-sm font-medium text-fixlab-charcoal">Click to upload image</p>
                <p className="text-xs text-fixlab-gray mt-1">PNG, JPG up to 5MB</p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-bold text-fixlab-charcoal mb-2 block">Service Title</label>
            <input type="text" required placeholder="e.g. iPhone Screen Replacement" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-fixlab-cream outline-none focus:ring-2 focus:ring-fixlab-green/20" />
          </div>
          <div>
            <label className="text-sm font-bold text-fixlab-charcoal mb-2 block">Category</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-fixlab-cream outline-none focus:ring-2 focus:ring-fixlab-green/20 cursor-pointer">
              <option>Smartphone</option>
              <option>Laptop & PC</option>
              <option>AC</option>
              <option>Refrigerator</option>
              <option>TV</option>
              <option>Washing Machine</option>
              <option>Electrical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-fixlab-charcoal mb-2 block">Description</label>
          <textarea required rows={3} placeholder="Describe what this service includes..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-fixlab-cream outline-none focus:ring-2 focus:ring-fixlab-green/20 resize-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-bold text-fixlab-charcoal mb-2 block">Base Price ($)</label>
            <input type="number" required min="1" placeholder="e.g. 49" value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-fixlab-cream outline-none focus:ring-2 focus:ring-fixlab-green/20" />
          </div>
          <div>
            <label className="text-sm font-bold text-fixlab-charcoal mb-2 block">Estimated Duration</label>
            <input type="text" required placeholder="e.g. 1-2 hours" value={formData.estimatedDuration} onChange={(e) => setFormData({...formData, estimatedDuration: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-fixlab-cream outline-none focus:ring-2 focus:ring-fixlab-green/20" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-bold text-fixlab-charcoal mb-2 block">Service Mode</label>
            <select value={formData.serviceMode} onChange={(e) => setFormData({...formData, serviceMode: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-fixlab-cream outline-none focus:ring-2 focus:ring-fixlab-green/20 cursor-pointer">
              <option>Home Visit</option>
              <option>Shop Drop-off</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-fixlab-charcoal mb-2 block">Service Area</label>
            <input type="text" required placeholder="e.g. Dhanmondi, Dhaka" value={formData.serviceArea} onChange={(e) => setFormData({...formData, serviceArea: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-fixlab-cream outline-none focus:ring-2 focus:ring-fixlab-green/20" />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-fixlab-gray mb-1 block">Technician Name</label>
              <input type="text" readOnly value={session?.user?.name || ""} className="w-full px-4 py-3 rounded-xl bg-gray-100 text-fixlab-gray cursor-not-allowed" />
            </div>
            <div>
              <label className="text-xs font-bold text-fixlab-gray mb-1 block">Technician Email</label>
              <input type="email" readOnly value={session?.user?.email || ""} className="w-full px-4 py-3 rounded-xl bg-gray-100 text-fixlab-gray cursor-not-allowed" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 bg-fixlab-green text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-70 mt-4">
          {loading ? "Adding Service..." : "Add Service"}
        </button>
      </form>
    </div>
  );
}