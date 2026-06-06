"use client";

import { useEffect, useState } from "react";
import { Card, Loader } from "@lms/ui";
import { adminApi, type UserOut } from "@lms/api-client";

const roleStyle: Record<string, string> = {
  student: "bg-blue-50 text-blue-700",
  instructor: "bg-brand-50 text-brand-700",
  admin: "bg-amber-50 text-amber-700",
  tenant_admin: "bg-amber-50 text-amber-700",
  super_admin: "bg-amber-50 text-amber-700",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserOut[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    adminApi.users()
      .then(setUsers)
      .catch(() => {
        setError(true);
        setUsers([]);
      });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage all registered users in your tenant.</p>
        </div>
      </div>

      {users === null ? (
        <div className="mt-10 flex justify-center"><Loader size="lg" /></div>
      ) : error ? (
        <div className="mt-10 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
          Failed to load users. Please check your connection or permissions.
        </div>
      ) : users.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">There are no users registered in this tenant yet.</p>
        </div>
      ) : (
        <Card className="mt-6 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {users.map((u) => {
                  const roleCode = u.roles[0]?.code?.toLowerCase() ?? "student";
                  const style = roleStyle[roleCode] ?? "bg-surface-muted text-gray-600";
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{u.full_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
                          {roleCode.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${u.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
