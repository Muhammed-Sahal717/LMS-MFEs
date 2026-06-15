"use client";

import { useState, useEffect } from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, Input, Button, Modal, Loader, 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, EmptyState
} from "@lms/ui";
import { adminApi, useAuth, setTenantId, type TenantOut, type TenantModuleOut } from "@lms/api-client";
import { Building2, ArrowRightLeft, Component, AlertTriangle } from "lucide-react";

export default function TenantsPage() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<TenantOut[] | null>(null);
  const [error, setError] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingModulesFor, setEditingModulesFor] = useState<TenantOut | null>(null);

  // Local state for context switcher
  const [activeTenant, setActiveTenant] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("tenant_id") || "full-lms";
    }
    return "full-lms";
  });

  function loadTenants() {
    adminApi.tenants()
      .then(setTenants)
      .catch(() => {
        setError(true);
        setTenants([]);
      });
  }

  useEffect(() => {
    loadTenants();
  }, []);

  const handleTenantSwitch = (tenantId: string) => {
    setActiveTenant(tenantId);
    setTenantId(tenantId);
    window.location.reload(); // Reload to fetch fresh data for the new tenant context
  };

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))]">Tenant Management</h1>
          <p className="text-[hsl(var(--muted-foreground))] mt-2">Manage companies, organizations, and their licensed modules.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto shadow-sm">Create Tenant</Button>
      </div>

      {tenants === null ? (
        <div className="mt-20 flex flex-col items-center justify-center">
          <Loader size="lg" label="Loading tenants…" />
        </div>
      ) : error ? (
        <div className="mt-10 rounded-2xl border border-[hsl(var(--destructive)/0.2)] bg-[hsl(var(--destructive)/0.05)] p-6 text-center text-[hsl(var(--destructive))] shadow-sm flex flex-col items-center">
          <AlertTriangle className="w-10 h-10 mb-2" />
          <p className="font-medium">Failed to load tenants.</p>
          <p className="text-sm mt-1">Please check your connection or permissions.</p>
        </div>
      ) : tenants.length === 0 ? (
        <EmptyState 
           icon={<Building2 className="w-8 h-8" />}
           title="No tenants found"
           description="There are no tenants configured in the system."
           variant="dashed"
           className="mt-8"
        />
      ) : (
        <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-[var(--shadow-sm)]">
          <Table>
            <TableHeader className="bg-[hsl(var(--muted)/0.3)]">
              <TableRow>
                <TableHead>Tenant Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[hsl(var(--border))]">
              {tenants.map((t) => (
                <TableRow key={t.id} className="group hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                  <TableCell className="font-medium text-[hsl(var(--foreground))] flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center text-[hsl(var(--primary))]">
                      <Building2 className="w-4 h-4" />
                    </div>
                    {t.name}
                    {activeTenant === t.slug && (
                      <Badge variant="default" className="ml-2 text-[10px] uppercase">Active Context</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))] font-mono text-xs">{t.slug}</TableCell>
                  <TableCell>
                    {t.is_active 
                      ? <Badge variant="success">Active</Badge> 
                      : <Badge variant="danger">Inactive</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingModulesFor(t)}>
                      <Component className="w-4 h-4 mr-2" /> Modules
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleTenantSwitch(t.slug)} disabled={activeTenant === t.slug}>
                      <ArrowRightLeft className="w-4 h-4 mr-2" /> Switch
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateTenantModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => { setIsCreateModalOpen(false); loadTenants(); }}
      />

      {editingModulesFor && (
        <EditModulesModal
          tenant={editingModulesFor}
          onClose={() => setEditingModulesFor(null)}
        />
      )}
    </div>
  );
}

function CreateTenantModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantSlug, setNewTenantSlug] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminApi.createTenant({ 
        name: newTenantName, 
        slug: newTenantSlug,
        admin_email: adminEmail,
        admin_password: adminPassword,
        modules: ["AUTH", "COURSES", "LEARNING", "ASSIGNMENTS", "DASHBOARD", "ADMIN"]
      });
      setNewTenantName("");
      setNewTenantSlug("");
      setAdminEmail("");
      setAdminPassword("");
      onCreated();
    } catch (err: any) {
      setError(err.details ? JSON.stringify(err.details) : err.message || "Failed to create tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Tenant">
      <form onSubmit={handleCreateTenant} className="space-y-4">
        {error && (
          <div className="rounded-[var(--radius-md)] bg-[hsl(var(--destructive)/0.1)] p-3 text-sm text-[hsl(var(--destructive))] border border-[hsl(var(--destructive)/0.2)]">
            {error}
          </div>
        )}
        <Input
          label="Tenant Name"
          placeholder="e.g., XYZ University"
          value={newTenantName}
          onChange={(e) => setNewTenantName(e.target.value)}
          required
        />
        <Input
          label="Tenant Slug"
          placeholder="e.g., xyz-university"
          value={newTenantSlug}
          onChange={(e) => setNewTenantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          required
        />
        
        <div className="border-t border-[hsl(var(--border))] mt-4 pt-4">
          <h4 className="text-sm font-medium text-[hsl(var(--foreground))] mb-4">Initial Admin Account</h4>
          <div className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              placeholder="admin@xyz-university.com"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
            <Input
              label="Admin Password"
              type="password"
              placeholder="Min 8 characters"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} loading={loading}>
            Create Tenant
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function EditModulesModal({
  tenant,
  onClose,
}: {
  tenant: TenantOut;
  onClose: () => void;
}) {
  const [modules, setModules] = useState<TenantModuleOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.listTenantModules(tenant.id)
      .then(setModules)
      .catch((err) => setError(err.message || "Failed to load modules"))
      .finally(() => setLoading(false));
  }, [tenant.id]);

  const toggleModule = async (mod: TenantModuleOut) => {
    if (mod.code === "AUTH") return; // AUTH cannot be disabled
    
    // Optimistic update
    const previous = [...modules];
    setModules(modules.map(m => m.code === mod.code ? { ...m, enabled: !m.enabled } : m));
    
    try {
      await adminApi.toggleTenantModule(tenant.id, { code: mod.code, enabled: !mod.enabled });
    } catch (err: any) {
      // Revert on failure
      setModules(previous);
      alert(err.message || "Failed to toggle module");
    }
  };

  return (
    <Modal open={true} onClose={onClose} title={`Modules for ${tenant.name}`}>
      <div className="space-y-4 min-h-[300px]">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Toggle the features licensed and available for this specific tenant.
        </p>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader size="md" />
          </div>
        ) : error ? (
          <div className="text-sm text-[hsl(var(--destructive))] p-4 bg-[hsl(var(--destructive)/0.1)] rounded-md">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 mt-4">
            {modules.map((mod) => {
              const isAuth = mod.code === "AUTH";
              return (
                <div 
                  key={mod.code} 
                  className={`flex items-center justify-between p-4 rounded-[var(--radius-md)] border ${mod.enabled ? 'border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.05)]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${mod.enabled ? 'bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'}`}>
                      <Component className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">{mod.name}</h4>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] font-mono">{mod.code}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <button
                      type="button"
                      disabled={isAuth}
                      onClick={() => toggleModule(mod)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--background))] ${
                        mod.enabled ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted-foreground)/0.3)]'
                      } ${isAuth ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          mod.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end pt-4 mt-6 border-t border-[hsl(var(--border))]">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </Modal>
  );
}
