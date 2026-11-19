"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

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
      // JWT টোকেন ফেচ করা
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
      // চাইলে এখানেই রিডাইরেক্ট করতে পারেন, তবে টোকেন ছাড়া ড্যাশবোর্ড কাজ করবে না
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-fixlab-cream">
      <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[32px] w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
        <div className="flex flex-col items-center mb-8">
          <Image src="/fixlab-icon.png" alt="FixLab" width={80} height={80} className="mb-4 rounded-2xl shadow-lg" />
          <h1 className="text-2xl font-bold text-fixlab-green">Welcome Back</h1>
          <p className="text-sm text-fixlab-gray mt-1">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            disabled={loading}
            className="w-full mt-6 py-3.5 bg-fixlab-green text-white rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-fixlab-green/30 disabled:opacity-70"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-fixlab-gray mt-6">
          Don't have an account? <Link href="/sign-up" className="text-fixlab-green font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}