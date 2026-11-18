"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/api/admin/users")
      .then((data) => setUsers(data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await fetchApi(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-fixlab-green" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Manage Users</h1>
        <p className="text-fixlab-gray text-sm">View and update user roles across the platform.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fixlab-cream border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">User</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1A432A&color=fff&bold=true`} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      <p className="font-bold text-sm text-fixlab-charcoal">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                      user.role === "admin" ? "bg-purple-100 text-purple-700" :
                      user.role === "technician" ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      disabled={user.role === "admin"} 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="px-3 py-2 text-xs font-bold border border-gray-200 rounded-lg outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="customer">Customer</option>
                      <option value="technician">Technician</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}