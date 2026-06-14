"use client";

import { useEffect, useState } from "react";
import { Card, Loader, Badge, Button, Modal, Input } from "@lms/ui";
import { adminApi, type UserOut } from "@lms/api-client";
import { AlertTriangle, UserX } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserOut[] | null>(null);
  const [error, setError] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  function reload() {
    adminApi.users()
      .then(setUsers)
      .catch(() => {
        setError(true);
        setUsers([]);
      });
  }

  useEffect(() => {
    reload();
  }, []);

  function getRoleBadge(roles: { code: string }[]) {
    const code = roles[0]?.code?.toLowerCase() ?? "student";
    if (code.includes("admin")) return <Badge variant="warning">{code.replace('_', ' ')}</Badge>;
    if (code === "instructor") return <Badge variant="info">Instructor</Badge>;
    return <Badge variant="default">Student</Badge>;
  }

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Users</h1>
          <p className="mt-2 text-gray-500">View and manage all registered users in your tenant.</p>
        </div>
        <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setShowCreate(true)}>Invite User</Button>
      </div>

      {users === null ? (
        <div className="mt-20 flex flex-col items-center justify-center">
          <Loader size="lg" label="Loading users…" />
        </div>
      ) : error ? (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 shadow-sm flex flex-col items-center">
          <AlertTriangle className="w-10 h-10 mb-2" />
          <p className="font-medium">Failed to load users.</p>
          <p className="text-sm mt-1">Please check your connection or permissions.</p>
        </div>
      ) : users.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
          <UserX className="text-gray-400 w-12 h-12 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No users found</h3>
          <p className="mt-2 text-gray-500">There are no users registered in this tenant yet.</p>
        </div>
      ) : (
        <Card className="overflow-hidden p-0 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80">
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{u.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 group-hover:text-gray-700 transition-colors">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(u.roles)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {u.is_active 
                        ? <Badge variant="success">Active</Badge> 
                        : <Badge variant="danger">Inactive</Badge>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <CreateUserModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => { setShowCreate(false); reload(); }}
      />
    </div>
  );
}

function CreateUserModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleCode, setRoleCode] = useState("student");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      await adminApi.createUser({
        email,
        password,
        full_name: fullName,
        role_code: roleCode,
      });
      setEmail(""); setPassword(""); setFullName(""); setRoleCode("student");
      onCreated();
    } catch (err: any) {
      setFormError(err.details ? JSON.stringify(err.details) : err.message || "Failed to create user.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Invite New User">
      <form onSubmit={submit} className="flex flex-col gap-4">
        {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Temporary Password" type="text" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input label="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Role</label>
          <select
            value={roleCode}
            onChange={(e) => setRoleCode(e.target.value)}
            className="rounded-lg border border-gray-300 p-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="tenant_admin">Tenant Admin</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Create User</Button>
        </div>
      </form>
    </Modal>
  );
}
