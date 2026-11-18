import { Wrench, CheckCircle, Clock } from "lucide-react";

export default function TechnicianDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Technician Overview</h1>
        <p className="text-fixlab-gray text-sm">Manage your services and incoming repair requests.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Wrench size={28} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-fixlab-charcoal">5</p>
            <p className="text-sm font-medium text-fixlab-gray">Total Services</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-fixlab-charcoal">3</p>
            <p className="text-sm font-medium text-fixlab-gray">Approved Services</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-fixlab-charcoal">2</p>
            <p className="text-sm font-medium text-fixlab-gray">Pending Requests</p>
          </div>
        </div>
      </div>
    </div>
  );
}