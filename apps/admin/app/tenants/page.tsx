"use client";

import { useState, useEffect } from "react";
import { Card, Input, Button, Modal, Loader } from "@lms/ui";
import { adminApi, useAuth, setTenantId, type TenantOut } from "@lms/api-client";
import { Building2, Settings } from "lucide-react";

export default function TenantsPage() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<TenantOut[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Tenant Form
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantSlug, setNewTenantSlug] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local state for dropdown (defaults to what's in local storage or fallback)
  const [activeTenant, setActiveTenant] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("tenant_id") || "full-lms";
    }
    return "full-lms";
  });

  function loadTenants() {
    adminApi.tenants().then(setTenants).catch(() => setTenants([]));
  }

  useEffect(() => {
    loadTenants();
  }, []);

  const handleTenantSwitch = (tenantId: string) => {
    setActiveTenant(tenantId);
    setTenantId(tenantId);
    window.location.reload(); // Reload to fetch fresh data for the new tenant context
  };

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
        modules: ["COURSES", "LEARNING", "ASSIGNMENTS", "DASHBOARD", "ADMIN"]
      });
      setIsModalOpen(false);
      setNewTenantName("");
      setNewTenantSlug("");
      setAdminEmail("");
      setAdminPassword("");
      loadTenants(); // reload dynamic list
    } catch (err: any) {
      setError(err.details ? JSON.stringify(err.details) : err.message || "Failed to create tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tenant Management</h1>
          <p className="text-gray-500 mt-1">Super Admin global operations.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Create Tenant</Button>
      </div>

      <Card header={<div className="flex items-center gap-2"><Building2 className="w-5 h-5 text-gray-500" /> Switch Active Tenant</div>}>
        <div className="py-2">
          <p className="text-sm text-gray-600 mb-4">
            Select a tenant from the dropdown below to impersonate them. All subsequent API calls and dashboard views will be scoped to this tenant.
          </p>
          <div className="max-w-md flex items-center gap-4">
            {tenants === null ? (
              <Loader size="sm" />
            ) : (
              <select
                value={activeTenant}
                onChange={(e) => handleTenantSwitch(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.slug}>
                    {t.name} ({t.slug})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </Card>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Tenant">
        <form onSubmit={handleCreateTenant} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
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
          
          <div className="border-t border-gray-200 mt-4 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Initial Admin Account</h4>
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
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Tenant"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
