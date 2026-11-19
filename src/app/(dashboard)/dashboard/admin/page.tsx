"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Users, UserCheck, Wrench, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalTechnicians: 0, pendingServices: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/api/admin/stats")
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-fixlab-green" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Admin Overview</h1>
        <p className="text-fixlab-gray text-sm">Monitor platform activity, users, and revenue.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center"><Users size={28} /></div>
          <div><p className="text-2xl font-extrabold text-fixlab-charcoal">{stats.totalUsers}</p><p className="text-sm font-medium text-fixlab-gray">Total Users</p></div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center"><UserCheck size={28} /></div>
          <div><p className="text-2xl font-extrabold text-fixlab-charcoal">{stats.totalTechnicians}</p><p className="text-sm font-medium text-fixlab-gray">Technicians</p></div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center"><Wrench size={28} /></div>
          <div><p className="text-2xl font-extrabold text-fixlab-charcoal">{stats.pendingServices}</p><p className="text-sm font-medium text-fixlab-gray">Pending Services</p></div>
        </div>
      </div>
    </div>
  );
}