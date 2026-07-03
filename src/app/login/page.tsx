"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { LogIn, Shield, Users, FileCheck } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { DEMO_CREDENTIALS } from "@/lib/roles";
import { BRAND } from "@/lib/brand";
import { BankLogo } from "@/components/brand/BankLogo";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push(data.home);
      router.refresh();
    } else {
      setError(data.error ?? "Login gagal");
      setLoading(false);
    }
  }

  function fillDemo(user: string, pass: string) {
    setUsername(user);
    setPassword(pass);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Hero panel */}
      <div className="relative hidden w-[55%] overflow-hidden lg:block">
        <Image
          src={BRAND.images.loginHero}
          alt="Bank Sumut — Gedung Corporate"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 gradient-navy opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-900/40 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-4">
              <BankLogo size={52} />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{BRAND.name}</h1>
                <p className="text-sm text-brand-300">{BRAND.tagline}</p>
              </div>
            </div>
            <p className="mt-10 max-w-lg text-lg leading-relaxed text-slate-200">
              Platform digital Corporate Secretary untuk pengelolaan memorandum, agenda Direksi,
              dan alur persetujuan multi-level Bank Sumut.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: FileCheck, label: "Memorandum Digital" },
                { icon: Users, label: "7 Level Workflow" },
                { icon: Shield, label: "AI Compliance Review" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <Icon className="mb-2 h-5 w-5 text-brand-400" />
                  <p className="text-xs font-medium text-slate-200">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between">
            <p className="text-sm text-slate-400">© 2026 {BRAND.name}. All rights reserved.</p>
            <div className="hidden h-20 w-32 overflow-hidden rounded-lg border border-white/20 xl:block">
              <Image
                src={BRAND.images.corporate}
                alt="Bank Sumut Corporate"
                width={128}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col justify-center px-6 py-10 lg:px-14">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <BankLogo size={44} />
            <div>
              <p className="font-bold text-navy-900">{APP_NAME}</p>
              <p className="text-xs text-slate-500">{BRAND.tagline}</p>
            </div>
          </div>

          <div className="mb-2 h-1 w-16 rounded-full gradient-brand-accent" />
          <h2 className="text-2xl font-bold text-navy-900">Masuk ke Sistem</h2>
          <p className="mt-1 text-sm text-slate-500">
            Corporate Secretary — pilih akun sesuai level Anda
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="input-field"
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="input-field"
                placeholder="Masukkan password"
              />
            </div>
            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2">
              <LogIn className="h-4 w-4" />
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-navy-600">
              Akun Demo
            </p>
            <div className="max-h-52 space-y-2 overflow-y-auto">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.username}
                  type="button"
                  onClick={() => fillDemo(cred.username, cred.password)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-left text-xs transition hover:border-brand-300 hover:bg-brand-50"
                >
                  <span className="font-medium text-navy-900">{cred.role}</span>
                  <span className="font-mono text-slate-500">
                    {cred.username} / {cred.password}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
