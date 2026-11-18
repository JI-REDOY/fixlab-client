import { DollarSign } from "lucide-react";

const transactions = [
  { _id: "t1", customer: "Arpa Das", technician: "Rahim Uddin", service: "iPhone Screen Replacement", amount: 49, txnId: "pi_3MtwBw...", date: "2024-10-20" },
  { _id: "t2", customer: "Sajid Khan", technician: "Karim Ahmed", service: "MacBook Battery", amount: 89, txnId: "pi_3MtwBx...", date: "2024-10-18" },
];

export default function AdminTransactionsPage() {
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Transactions</h1>
        <p className="text-fixlab-gray text-sm">Every payment processed on the platform.</p>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-fixlab-green text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 w-full sm:w-80">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
          <DollarSign size={28} />
        </div>
        <div>
          <p className="text-sm font-medium text-fixlab-mint">Total Revenue</p>
          <p className="text-3xl font-extrabold">${totalRevenue}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fixlab-cream border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Technician</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Txn ID</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-bold text-fixlab-charcoal">{t.customer}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{t.technician}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{t.service}</td>
                  <td className="px-6 py-4 text-sm font-mono text-fixlab-gray">{t.txnId}</td>
                  <td className="px-6 py-4 text-sm font-bold text-fixlab-green">${t.amount}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}