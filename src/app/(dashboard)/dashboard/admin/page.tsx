import { Users, UserCheck, Wrench, FileText, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Admin Overview</h1>
        <p className="text-fixlab-gray text-sm">Monitor platform activity, users, and revenue.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-fixlab-charcoal">120</p>
            <p className="text-sm font-medium text-fixlab-gray">Total Users</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <UserCheck size={28} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-fixlab-charcoal">45</p>
            <p className="text-sm font-medium text-fixlab-gray">Technicians</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Wrench size={28} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-fixlab-charcoal">8</p>
            <p className="text-sm font-medium text-fixlab-gray">Pending Services</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-fixlab-charcoal">$4,520</p>
            <p className="text-sm font-medium text-fixlab-gray">Total Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}