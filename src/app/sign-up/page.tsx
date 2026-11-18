"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer" as "customer" | "technician",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    
    // Password Validation
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
      callbackURL: `/dashboard/${formData.role}`,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      // Custom JWT Generation (Server e call kora)
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      }).then(res => res.json()).then(data => {
        if (data.token) localStorage.setItem("fixlab_token", data.token);
      });

      toast.success("Account created successfully!");
      router.push(`/dashboard/${formData.role}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('/bg-pattern.png')] bg-cover">
      <div className="glass-card p-8 rounded-3xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Image src="/fixlab-icon.png" alt="FixLab" width={80} height={80} className="mb-4 rounded-2xl" />
          <h1 className="text-2xl font-bold text-fixlab-green">Create an Account</h1>
          <p className="text-sm text-fixlab-gray mt-1">Join FixLab to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm font-medium text-fixlab-charcoal">Select Role</label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'customer' ? 'border-fixlab-green bg-fixlab-mint/10' : 'border-gray-200'}`}>
                <input type="radio" name="role" value="customer" checked={formData.role === 'customer'} onChange={() => setFormData({ ...formData, role: 'customer' })} className="hidden" />
                <span className="text-sm font-semibold">Customer</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'technician' ? 'border-fixlab-green bg-fixlab-mint/10' : 'border-gray-200'}`}>
                <input type="radio" name="role" value="technician" checked={formData.role === 'technician'} onChange={() => setFormData({ ...formData, role: 'technician' })} className="hidden" />
                <span className="text-sm font-semibold">Technician</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 py-3.5 bg-fixlab-green text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-70"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-fixlab-gray mt-6">
          Already have an account? <Link href="/sign-in" className="text-fixlab-green font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}