"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/CustomToast";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

function SuccessContent() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!session_id) {
      setLoading(false);
      return;
    }
    
    fetchApi(`/api/payments/verify?session_id=${session_id}`)
      .then(() => {
        setSuccess(true);
        toast.success("Payment successful!");
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [session_id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-fixlab-green" size={48} /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9FA]">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-500" size={40} />
        </div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal mb-2">Payment Successful!</h1>
        <p className="text-fixlab-gray mb-8">Your transaction has been processed successfully.</p>
        <Link href="/dashboard/customer/bookings" className="block w-full py-3.5 bg-fixlab-green text-white font-bold rounded-xl hover:bg-opacity-90 transition-all">
          Back to My Bookings
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-fixlab-green" size={48} /></div>}>
      <SuccessContent />
    </Suspense>
  );
}