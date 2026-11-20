"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  UploadCloud,
  Save,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
    bio: "",
    image: "",
  });

  // সেশন লোড হলে ফর্ম ডেটা আপডেট করা
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: (session.user as any).phone || "",
        area: (session.user as any).area || "",
        bio: (session.user as any).bio || "",
        image: session.user.image || "",
      });
      setImagePreview(session.user.image || null);
    }
  }, [session]);

  if (isPending) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#ff5722]" size={42} />
      </div>
    );
  }

  if (!session) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      // TODO: ImgBB API Integration
      setFormData({
        ...formData,
        image:
          "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // এখানে আমরা BetterAuth-এর updateUser কল করব
    try {
      const { error } = await authClient.updateUser({
        name: formData.name,
        image: formData.image,
        phone: formData.phone,
        area: formData.area,
        bio: formData.bio,
      } as any);

      if (error) {
        toast.error(error.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    session.user.name || "User"
  )}&background=ff5722&color=fff&bold=true`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
      {/* Transparent Soft UI Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-transparent hover:bg-white/5 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 p-6 sm:p-8 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300">
        <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
          <Sparkles size={12} /> Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Update <span className="text-[#ff5722]">Profile</span>
        </h1>
        <p className="text-gray-700 text-sm font-medium mt-1">
          Manage your personal information and profile photo.
        </p>
      </div>

      {/* Transparent Soft UI Form Card */}
      <div className="relative overflow-hidden bg-transparent backdrop-blur-[1px] rounded-[2rem] border border-white/85 ring-1 ring-slate-900/12 p-6 sm:p-8 shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)]">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-7 border-b border-white/75">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white/90 ring-2 ring-[#ff5722]/35 bg-white/15 shrink-0 shadow-[8px_8px_18px_rgba(15,23,42,0.12),-6px_-6px_14px_rgba(255,255,255,0.92)]">
              <img
                src={imagePreview || fallbackAvatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center sm:text-left">
              <h3 className="text-sm font-extrabold text-gray-900 mb-1.5">
                Profile Photo
              </h3>
              <p className="text-xs font-medium text-gray-700 mb-4">
                JPG, PNG or GIF. Max size 2MB.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 rounded-full cursor-pointer shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)] transition-all">
                <UploadCloud size={17} className="text-[#ff5722]" />
                <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                  Upload New Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-2">
                <User size={13} className="text-[#ff5722]" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl bg-white/15 focus:bg-white/25 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/12 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-[#ff5722]/35 focus:border-[#ff5722]/50 shadow-[inset_1px_1px_3px_rgba(15,23,42,0.07),4px_4px_10px_rgba(15,23,42,0.06)] transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-2">
                <Mail size={13} className="text-[#ff5722]" />
                <span>Email (Read-only)</span>
              </label>
              <input
                type="email"
                readOnly
                value={session.user.email}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-[1px] border border-white/75 ring-1 ring-slate-900/8 text-sm font-semibold text-gray-600 cursor-not-allowed shadow-[inset_1px_1px_3px_rgba(15,23,42,0.06)]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-2">
                <Phone size={13} className="text-[#ff5722]" />
                <span>Phone</span>
              </label>
              <input
                type="text"
                placeholder="+880 1XXX XXXXXX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl bg-white/15 focus:bg-white/25 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/12 text-sm font-semibold text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#ff5722]/35 focus:border-[#ff5722]/50 shadow-[inset_1px_1px_3px_rgba(15,23,42,0.07),4px_4px_10px_rgba(15,23,42,0.06)] transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-2">
                <MapPin size={13} className="text-[#ff5722]" />
                <span>Area / City</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Mirpur, Dhaka"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl bg-white/15 focus:bg-white/25 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/12 text-sm font-semibold text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#ff5722]/35 focus:border-[#ff5722]/50 shadow-[inset_1px_1px_3px_rgba(15,23,42,0.07),4px_4px_10px_rgba(15,23,42,0.06)] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-2">
              <FileText size={13} className="text-[#ff5722]" />
              <span>Short Bio</span>
            </label>
            <textarea
              rows={4}
              placeholder="Tell us a little about yourself (useful for technicians)..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full px-4 py-3 rounded-2xl bg-white/15 focus:bg-white/25 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/12 text-sm font-medium text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#ff5722]/35 focus:border-[#ff5722]/50 resize-none shadow-[inset_1px_1px_3px_rgba(15,23,42,0.07),4px_4px_10px_rgba(15,23,42,0.06)] transition-all"
            />
          </div>

          <div className="pt-5 border-t border-white/75 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-sm font-extrabold rounded-full transition-all shadow-[6px_6px_16px_rgba(255,87,34,0.34),-4px_-4px_10px_rgba(255,255,255,0.85)] disabled:opacity-65 cursor-pointer"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}