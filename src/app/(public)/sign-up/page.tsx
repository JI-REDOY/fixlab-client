"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import { ArrowRight, User, Wrench, UploadCloud } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer" as "customer" | "technician",
    image: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    const imgData = new FormData();
    imgData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";

    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    else if (!/[A-Z]/.test(formData.password)) newErrors.password = "Must contain an uppercase letter";
    else if (!/[a-z]/.test(formData.password)) newErrors.password = "Must contain a lowercase letter";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const { error } = await authClient.signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role,
      image: formData.image,
      callbackURL: `/dashboard/${formData.role}`,
    });

    if (error) {
      toast.error(error.message || "Something went wrong");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!res.ok) throw new Error("Failed to generate token");

      const data = await res.json();
      if (data.token) localStorage.setItem("fixlab_token", data.token);

      toast.success("Account created successfully!");
      router.push(`/dashboard/${formData.role}`);
    } catch (err) {
      toast.error("Account created, but failed to generate session token. Please sign in again.");
      router.push("/sign-in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // গুগল লগইন শুরু
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer",
      });

    } catch (error) {
      toast.error("Failed to sign in with Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-32 relative overflow-hidden">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff5722]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/40 relative z-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/30 border border-white/50 flex items-center justify-center mb-4 shadow-sm">
            <Image
              src="/icon-whiteTheme.png"
              alt="FixLab"
              width={40}
              height={40}
              className="object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Create an Account</h1>
          <p className="text-sm font-medium text-gray-600 mt-1">Join FixLab to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="flex flex-col gap-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
              />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
              />
            </div>

            <div className="flex flex-col gap-4">

              <div className="flex flex-col items-center justify-center gap-3">
                <label className="text-sm font-bold text-gray-800 self-start ml-1">Profile Photo</label>
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white/60 shadow-sm bg-white/20 flex items-center justify-center group cursor-pointer">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <UploadCloud size={32} className="text-gray-500 group-hover:text-[#ff5722] transition-colors" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-gray-500 font-medium text-center">Click to upload photo (Optional)</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-800 ml-1">Select Role</label>
                <div className="flex gap-3">
                  <label className={`flex-1 flex flex-col items-center justify-center gap-1 p-3 rounded-xl cursor-pointer transition-all border ${formData.role === 'customer' ? 'border-[#ff5722] bg-white/30 shadow-sm' : 'border-white/50 bg-white/10 hover:bg-white/20'}`}>
                    <input type="radio" name="role" value="customer" checked={formData.role === 'customer'} onChange={() => setFormData({ ...formData, role: 'customer' })} className="hidden" />
                    <User size={20} className={formData.role === 'customer' ? 'text-[#ff5722]' : 'text-gray-500'} />
                    <span className={`text-xs font-bold ${formData.role === 'customer' ? 'text-gray-900' : 'text-gray-600'}`}>Customer</span>
                  </label>

                  <label className={`flex-1 flex flex-col items-center justify-center gap-1 p-3 rounded-xl cursor-pointer transition-all border ${formData.role === 'technician' ? 'border-[#ff5722] bg-white/30 shadow-sm' : 'border-white/50 bg-white/10 hover:bg-white/20'}`}>
                    <input type="radio" name="role" value="technician" checked={formData.role === 'technician'} onChange={() => setFormData({ ...formData, role: 'technician' })} className="hidden" />
                    <Wrench size={20} className={formData.role === 'technician' ? 'text-[#ff5722]' : 'text-gray-500'} />
                    <span className={`text-xs font-bold ${formData.role === 'technician' ? 'text-gray-900' : 'text-gray-600'}`}>Technician</span>
                  </label>
                </div>
              </div>

            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading || uploading}
            className="w-full mt-2 py-3.5 bg-[#ff5722] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e64a19] transition-all shadow-[0_8px_20px_rgba(255,87,34,0.3)] disabled:opacity-70 group"
          >
            {loading ? "Creating Account..." : "Sign Up"}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-white/40 flex-1"></div>
          <span className="text-xs font-bold text-gray-500 uppercase">Or continue with</span>
          <div className="h-px bg-white/40 flex-1"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading || uploading}
          className="w-full py-3.5 bg-white/50 border border-white text-gray-800 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-all shadow-sm"
        >
          <FcGoogle size={22} />
          {googleLoading ? "Connecting..." : "Google"}
        </button>

        <p className="text-center text-sm font-medium text-gray-700 mt-8">
          Already have an account? <Link href="/sign-in" className="text-[#ff5722] font-bold hover:underline transition-all">Sign In</Link>
        </p>
      </div>
    </div>
  );
}