"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Input } from "@lms/ui";
import { authApi, ApiError, getTenantId, setTenantId } from "@lms/api-client";
import { AuthCard } from "../AuthCard";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tenantId, setLocalTenantId] = useState(() => getTenantId());

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      setTenantId(tenantId);
      await authApi.login(email, password);
      // Cross-zone nav → full reload so the dashboard zone boots with the session.
      window.location.href = "/dashboard";
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "rate_limited") setError("Too many attempts. Try again shortly.");
        else if (err.code === "tenant_required") setError("Tenant not configured.");
        else setError("Invalid email or password.");
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Sign in"
      subtitle="Welcome back. Enter your details."
      footer={
        <>
          No account?{" "}
          <Link href="/register" className="font-medium text-brand-700 hover:underline">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700" htmlFor="tenant-select">
            Tenant
          </label>
          <select
            id="tenant-select"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            value={tenantId}
            onChange={(e) => setLocalTenantId(e.target.value)}
          >
            <option value="full-lms">Full LMS (Default)</option>
            <option value="abc-academy">ABC Academy</option>
          </select>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-brand-700 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" loading={loading} fullWidth>
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}
