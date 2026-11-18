import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="text-red-500" size={40} />
        </div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal mb-2">Payment Cancelled</h1>
        <p className="text-fixlab-gray mb-8">You have cancelled the payment. No charges were made.</p>
        <Link href="/dashboard/customer/bookings" className="block w-full py-3.5 bg-fixlab-green text-white font-bold rounded-xl hover:bg-opacity-90 transition-all">
          Try Again
        </Link>
      </div>
    </div>
  );
}