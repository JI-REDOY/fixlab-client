"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  UploadCloud,
  Loader2,
  Sparkles,
  Wrench,
  Layers,
  FileText,
  DollarSign,
  Clock,
  MapPin,
  Settings,
  User,
  Mail,
} from "lucide-react";
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
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imgData,
        }
      );
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
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
        body: JSON.stringify({
          ...formData,
          basePrice: Number(formData.basePrice),
        }),
      });
      toast.success("Service added! Waiting for admin approval.");
      router.push("/dashboard/technician/my-services");
    } catch (err: any) {
      toast.error(err?.message || "Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-2xl bg-white/15 focus:bg-white/25 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/12 text-sm font-semibold text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#ff5722]/35 focus:border-[#ff5722]/50 shadow-[inset_1px_1px_3px_rgba(15,23,42,0.07),4px_4px_10px_rgba(15,23,42,0.06)] transition-all";

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative z-10">
      {/* Transparent Soft UI Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-transparent hover:bg-white/5 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 p-6 sm:p-8 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300">
        <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
          <Sparkles size={12} /> New Listing
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Add a New <span className="text-[#ff5722]">Service</span>
        </h1>
        <p className="text-gray-700 text-sm font-medium mt-1">
          Fill out the details to list your repair service.
        </p>
      </div>

      {/* Transparent Soft UI Form Card */}
      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden bg-transparent backdrop-blur-[1px] p-6 sm:p-8 rounded-[2rem] border border-white/85 ring-1 ring-slate-900/12 shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] space-y-6"
      >
        {/* Image Upload */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-2">
            <UploadCloud size={13} className="text-[#ff5722]" />
            <span>Service Image</span>
          </label>
          <div className="border-2 border-dashed border-white/90 ring-1 ring-slate-900/12 bg-white/10 hover:bg-white/20 backdrop-blur-[1px] rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-center transition-all relative cursor-pointer shadow-[inset_1px_1px_3px_rgba(15,23,42,0.06),5px_5px_12px_rgba(15,23,42,0.08)]">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {uploading ? (
              <Loader2 className="animate-spin text-[#ff5722]" size={34} />
            ) : imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 object-contain rounded-2xl border border-white/90 shadow-[4px_4px_10px_rgba(15,23,42,0.1)]"
              />
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/90 ring-1 ring-[#ff5722]/25 flex items-center justify-center text-[#ff5722] mb-2.5 shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)]">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-extrabold text-gray-900">
                  Click to upload image
                </p>
                <p className="text-xs font-medium text-gray-700 mt-1">
                  PNG, JPG up to 5MB
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-2">
              <Wrench size={13} className="text-[#ff5722]" />
              <span>Service Title</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. iPhone Screen Replacement"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-2">
              <Layers size={13} className="text-[#ff5722]" />
              <span>Category</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={`${inputClass} cursor-pointer`}
            >
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
          <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-2">
            <FileText size={13} className="text-[#ff5722]" />
            <span>Description</span>
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe what this service includes..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-2">
              <DollarSign size={13} className="text-[#ff5722]" />
              <span>Base Price ($)</span>
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 49"
              value={formData.basePrice}
              onChange={(e) =>
                setFormData({ ...formData, basePrice: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-2">
              <Clock size={13} className="text-[#ff5722]" />
              <span>Estimated Duration</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1-2 hours"
              value={formData.estimatedDuration}
              onChange={(e) =>
                setFormData({ ...formData, estimatedDuration: e.target.value })
              }
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-2">
              <Settings size={13} className="text-[#ff5722]" />
              <span>Service Mode</span>
            </label>
            <select
              value={formData.serviceMode}
              onChange={(e) =>
                setFormData({ ...formData, serviceMode: e.target.value })
              }
              className={`${inputClass} cursor-pointer`}
            >
              <option>Home Visit</option>
              <option>Shop Drop-off</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-2">
              <MapPin size={13} className="text-[#ff5722]" />
              <span>Service Area</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dhanmondi, Dhaka"
              value={formData.serviceArea}
              onChange={(e) =>
                setFormData({ ...formData, serviceArea: e.target.value })
              }
              className={inputClass}
            />
          </div>
        </div>

        <div className="pt-5 border-t border-white/75">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                <User size={12} className="text-[#ff5722]" />
                <span>Technician Name</span>
              </label>
              <input
                type="text"
                readOnly
                value={session?.user?.name || ""}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-[1px] border border-white/75 ring-1 ring-slate-900/8 text-sm font-semibold text-gray-600 cursor-not-allowed shadow-[inset_1px_1px_3px_rgba(15,23,42,0.06)]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                <Mail size={12} className="text-[#ff5722]" />
                <span>Technician Email</span>
              </label>
              <input
                type="email"
                readOnly
                value={session?.user?.email || ""}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-[1px] border border-white/75 ring-1 ring-slate-900/8 text-sm font-semibold text-gray-600 cursor-not-allowed shadow-[inset_1px_1px_3px_rgba(15,23,42,0.06)]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full py-4 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-sm font-extrabold rounded-full transition-all shadow-[6px_6px_16px_rgba(255,87,34,0.34),-4px_-4px_10px_rgba(255,255,255,0.85)] disabled:opacity-65 mt-2 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading && <Loader2 className="animate-spin" size={20} />}
          <span>{loading ? "Adding Service..." : "Add Service"}</span>
        </button>
      </form>
    </div>
  );
}