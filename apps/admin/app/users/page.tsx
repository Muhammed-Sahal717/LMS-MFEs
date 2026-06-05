"use client";

import { useEffect, useState } from "react";
import { Card, Loader } from "@lms/ui";
import { adminApi, type User } from "@lms/api-client";

const roleStyle: Record<User["role"], string> = {
  student: "bg-blue-50 text-blue-700",
  instructor: "bg-brand-50 text-brand-700",
  admin: "bg-amber-50 text-amber-700",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    adminApi.users().then(setUsers).catch(() => setUsers([]));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>

      {users === null ? (
        <div className="mt-10 flex justify-center"><Loader size="lg" /></div>
      ) : (
        <Card className="mt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-gray-400">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="py-3 text-gray-600">{u.email}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyle[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
