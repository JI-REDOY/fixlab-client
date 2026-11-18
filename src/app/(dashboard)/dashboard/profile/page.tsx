"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";
import { UploadCloud, Save } from "lucide-react";

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

  if (isPending) return <div className="p-8 text-center">Loading profile...</div>;
  if (!session) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      // TODO: ImgBB API Integration
      setFormData({ ...formData, image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200" });
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Update Profile</h1>
        <p className="text-fixlab-gray text-sm">Manage your personal information and profile photo.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Profile Image Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-fixlab-mint shrink-0">
              <img
                src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name)}&background=1A432A&color=fff&bold=true`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-fixlab-charcoal mb-2">Profile Photo</h3>
              <p className="text-xs text-fixlab-gray mb-3">JPG, PNG or GIF. Max size 2MB.</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-fixlab-cream border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <UploadCloud size={18} className="text-fixlab-gray" />
                <span className="text-sm font-bold text-fixlab-charcoal">Upload New Photo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-bold text-fixlab-charcoal mb-2 block">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-fixlab-cream outline-none focus:ring-2 focus:ring-fixlab-green/20"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-fixlab-charcoal mb-2 block">Email (Read-only)</label>
              <input
                type="email"
                readOnly
                value={session.user.email}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 text-fixlab-gray cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-fixlab-charcoal mb-2 block">Phone</label>
              <input
                type="text"
                placeholder="+880 1XXX XXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-fixlab-cream outline-none focus:ring-2 focus:ring-fixlab-green/20"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-fixlab-charcoal mb-2 block">Area / City</label>
              <input
                type="text"
                placeholder="e.g. Mirpur, Dhaka"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-fixlab-cream outline-none focus:ring-2 focus:ring-fixlab-green/20"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-fixlab-charcoal mb-2 block">Short Bio</label>
            <textarea
              rows={4}
              placeholder="Tell us a little about yourself (useful for technicians)..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-fixlab-cream outline-none focus:ring-2 focus:ring-fixlab-green/20 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3.5 bg-fixlab-green text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-70"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}