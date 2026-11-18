import { FileText, Clock, CheckCircle } from "lucide-react";

export default function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Dashboard Overview</h1>
        <p className="text-fixlab-gray text-sm">Welcome back! Here is a summary of your repair jobs.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <FileText size={28} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-fixlab-charcoal">12</p>
            <p className="text-sm font-medium text-fixlab-gray">Total Requests</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-fixlab-charcoal">3</p>
            <p className="text-sm font-medium text-fixlab-gray">Active Jobs</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-fixlab-charcoal">9</p>
            <p className="text-sm font-medium text-fixlab-gray">Completed Jobs</p>
          </div>
        </div>
      </div>

      {/* Recent Activity (Dummy) */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-fixlab-charcoal mb-4">Recent Requests</h2>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-fixlab-cream rounded-2xl">
              <div>
                <p className="font-bold text-fixlab-charcoal">iPhone Screen Replacement</p>
                <p className="text-xs text-fixlab-gray">Requested on 12 Oct 2024</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Requested</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}