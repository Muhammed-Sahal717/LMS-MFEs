"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { Button, Input } from "@lms/ui";
import { authApi, ApiError, getTenantId, setTenantId, hasUrlTenant } from "@lms/api-client";
import { AuthCard } from "../AuthCard";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tenantId, setLocalTenantId] = useState(() => getTenantId());
  const [isUrlTenant, setIsUrlTenant] = useState(true);

  useEffect(() => {
    setIsUrlTenant(hasUrlTenant());
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      setTenantId(tenantId);
      await authApi.register({ email, password, full_name: fullName });
      // Register returns no tokens → log in to obtain the session.
      await authApi.login(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "conflict") setError("An account with this email already exists.");
        else if (err.code === "validation_error") {
          // The backend sends field-level validation errors in err.details
          const details = typeof err.details === "string" ? err.details : JSON.stringify(err.details);
          setError(`Validation error: ${details || "Check your details and try again."}`);
        }
        else setError(`Could not register: ${err.message || err.code}`);
      } else {
        setError(`Something went wrong: ${err instanceof Error ? err.message : String(err)}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Start learning in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-700 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Full name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Sahal"
        />
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
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />
        {!isUrlTenant && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700" htmlFor="tenant-select">
              Tenant (Local Testing Only)
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
        )}
        {error ? <p className="mt-1 text-sm text-red-600 rounded-md bg-red-50 p-2">{error}</p> : null}
        <Button type="submit" loading={loading} fullWidth>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
