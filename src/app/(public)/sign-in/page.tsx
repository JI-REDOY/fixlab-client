"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      toast.error(error.message || "Invalid credentials");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch token");
      }

      const tokenData = await res.json();

      if (tokenData.token) {
        localStorage.setItem("fixlab_token", tokenData.token);
        toast.success("Welcome back!");
        const role = data?.user?.role || 'customer';
        router.push(`/dashboard/${role}`);
      } else {
        throw new Error("No token received");
      }
    } catch (err: any) {
      toast.error(err.message || "Signed in, but failed to fetch session token.");
      setLoading(false);
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
    <div className="min-h-screen flex items-center justify-center p-4 pt-32 relative overflow-hidden">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff5722]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/40 relative z-10">

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
          <h1 className="text-2xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="text-sm font-medium text-gray-600 mt-1">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full mt-2 py-3.5 bg-[#ff5722] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e64a19] transition-all shadow-[0_8px_20px_rgba(255,87,34,0.3)] disabled:opacity-70 group"
          >
            {loading ? "Signing In..." : "Sign In"}
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
          disabled={loading || googleLoading}
          className="w-full py-3.5 bg-white/50 border border-white text-gray-800 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-all shadow-sm"
        >
          <FcGoogle size={22} />
          {googleLoading ? "Connecting..." : "Google"}
        </button>

        <p className="text-center text-sm font-medium text-gray-700 mt-8">
          Don't have an account? <Link href="/sign-up" className="text-[#ff5722] font-bold hover:underline transition-all">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}