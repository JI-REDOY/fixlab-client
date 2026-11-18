import { CreditCard } from "lucide-react";

const payments = [
  { id: "txn_123", service: "AC Servicing", technician: "Karim Ahmed", amount: 35, date: "2024-10-15" },
];

export default function PaymentHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Payment History</h1>
        <p className="text-fixlab-gray text-sm">All your completed transactions.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fixlab-cream border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Technician</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-mono text-fixlab-gray">{p.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-fixlab-charcoal">{p.service}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{p.technician}</td>
                  <td className="px-6 py-4 text-sm font-bold text-fixlab-green">${p.amount}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}