"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { UploadCloud, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY; // .env.local এ যোগ করুন

export default function AddServicePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    // ImgBB Upload
    const imgData = new FormData();
    imgData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: imgData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, image: data.data.url });
        toast.success("Image uploaded!");
      } else {
        toast.error("Image upload failed");
      }
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return toast.error("Please upload an image");
    
    setLoading(true);
    try {
      await fetchApi("/api/services", {
        method: "POST",
        body: JSON.stringify({ ...formData, basePrice: Number(formData.basePrice) }),
      });
      toast.success("Service added! Waiting for admin approval.");
      router.push("/dashboard/technician/my-services");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
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
            {uploading ? (
              <Loader2 className="animate-spin text-fixlab-green" size={32} />
            ) : imagePreview ? (
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

        <button type="submit" disabled={loading || uploading} className="w-full py-4 bg-fixlab-green text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-70 mt-4 flex items-center justify-center gap-2">
          {loading && <Loader2 className="animate-spin" size={20} />}
          {loading ? "Adding Service..." : "Add Service"}
        </button>
      </form>
    </div>
  );
}