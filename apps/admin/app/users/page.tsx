"use client";

import { useEffect, useState } from "react";
import { 
  Loader, Badge, Button, Modal, Input, EmptyState, 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Select
} from "@lms/ui";
import { adminApi, type UserOut } from "@lms/api-client";
import { AlertTriangle, UserX } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserOut[] | null>(null);
  const [error, setError] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<UserOut | null>(null);

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
          <h1 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">Manage Users</h1>
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">View and manage all registered users in your tenant.</p>
        </div>
        <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setShowCreate(true)}>Invite User</Button>
      </div>

      {users === null ? (
        <div className="mt-20 flex flex-col items-center justify-center">
          <Loader size="lg" label="Loading users…" />
        </div>
      ) : error ? (
        <div className="mt-10 rounded-2xl border border-[hsl(var(--destructive)/0.2)] bg-[hsl(var(--destructive)/0.05)] p-6 text-center text-[hsl(var(--destructive))] shadow-sm flex flex-col items-center">
          <AlertTriangle className="w-10 h-10 mb-2" />
          <p className="font-medium">Failed to load users.</p>
          <p className="text-sm mt-1">Please check your connection or permissions.</p>
        </div>
      ) : users.length === 0 ? (
        <EmptyState 
           icon={<UserX className="w-8 h-8" />}
           title="No users found"
           description="There are no users registered in this tenant yet."
           variant="dashed"
           className="mt-8"
        />
      ) : (
        <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-[var(--shadow-sm)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} className="group">
                  <TableCell className="font-medium text-[hsl(var(--foreground))]">{u.full_name}</TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))] transition-colors">{u.email}</TableCell>
                  <TableCell>
                    {getRoleBadge(u.roles)}
                  </TableCell>
                  <TableCell>
                    {u.is_active 
                      ? <Badge variant="success">Active</Badge> 
                      : <Badge variant="danger">Inactive</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setEditingUser(u)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateUserModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => { setShowCreate(false); reload(); }}
      />

      <EditUserModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdated={() => { setEditingUser(null); reload(); }}
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
        {formError ? <p className="text-sm text-[hsl(var(--destructive))]">{formError}</p> : null}
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Temporary Password" type="text" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input label="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        
        <Select
          label="Role"
          value={roleCode}
          onChange={(e) => setRoleCode(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="tenant_admin">Tenant Admin</option>
        </Select>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Create User</Button>
        </div>
      </form>
    </Modal>
  );
}

function EditUserModal({
  user,
  onClose,
  onUpdated,
}: {
  user: UserOut | null;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [roleCode, setRoleCode] = useState("student");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setIsActive(user.is_active);
      setRoleCode(user.roles && user.roles.length > 0 ? (user.roles[0]?.code ?? "student") : "student");
      setFormError(null);
    }
  }, [user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setFormError(null);
    setSaving(true);
    try {
      await adminApi.updateUser(user.id, {
        full_name: fullName,
        is_active: isActive,
        role_codes: [roleCode],
      });
      onUpdated();
    } catch (err: any) {
      setFormError(err.details ? JSON.stringify(err.details) : err.message || "Failed to update user.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <Modal open={!!user} onClose={onClose} title="Edit User">
      <form onSubmit={submit} className="flex flex-col gap-4">
        {formError ? <p className="text-sm text-[hsl(var(--destructive))]">{formError}</p> : null}
        
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">Email (Cannot be changed)</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-2.5 text-sm text-[hsl(var(--muted-foreground))] cursor-not-allowed"
          />
        </div>

        <Input label="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        
        <Select
          label="Role"
          value={roleCode}
          onChange={(e) => setRoleCode(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="tenant_admin">Tenant Admin</option>
        </Select>

        <div className="flex items-center gap-3 mt-2 p-3 bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))] rounded-[var(--radius-md)]">
          <input
            type="checkbox"
            id="is-active-toggle"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]"
          />
          <div className="flex flex-col">
            <label htmlFor="is-active-toggle" className="text-sm font-medium text-[hsl(var(--foreground))]">
              Active Status
            </label>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Uncheck to block this user from logging in.</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
