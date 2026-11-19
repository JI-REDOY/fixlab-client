"use client";

import { FileText, Clock, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Total", value: 12 },
  { name: "Active", value: 3 },
  { name: "Completed", value: 9 },
];

export default function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Dashboard Overview</h1>
        <p className="text-fixlab-gray text-sm">Welcome back! Here is a summary of your repair jobs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center"><FileText size={28} /></div>
          <div><p className="text-2xl font-extrabold text-fixlab-charcoal">12</p><p className="text-sm font-medium text-fixlab-gray">Total Requests</p></div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center"><Clock size={28} /></div>
          <div><p className="text-2xl font-extrabold text-fixlab-charcoal">3</p><p className="text-sm font-medium text-fixlab-gray">Active Jobs</p></div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center"><CheckCircle size={28} /></div>
          <div><p className="text-2xl font-extrabold text-fixlab-charcoal">9</p><p className="text-sm font-medium text-fixlab-gray">Completed Jobs</p></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-[300px]">
        <h2 className="text-lg font-bold text-fixlab-charcoal mb-4">Booking Summary</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Bar dataKey="value" fill="#1A432A" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}