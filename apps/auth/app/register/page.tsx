"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Input } from "@lms/ui";
import { authApi, ApiError } from "@lms/api-client";
import { AuthCard } from "../AuthCard";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.register({ email, password, full_name: fullName });
      // Register returns no tokens → log in to obtain the session.
      await authApi.login(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "conflict") setError("An account with this email already exists.");
        else if (err.code === "validation_error") setError("Check your details and try again.");
        else setError("Could not register.");
      } else {
        setError("Something went wrong. Is the backend running?");
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
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" loading={loading} fullWidth>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
