"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  Loader2,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import logo from "../../landing/assets/logo.png";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // In a real production app, you would have a more secure way to create the first admin
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "ADMIN" }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-1">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center" />

        <div className="rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#E6E6E6] bg-white p-3 shadow-xl">
              <Image
                src={logo}
                alt="Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              Admin Registration
            </h1>
            <p className="mt-2 text-slate-500">
              Create a new system administrator account
            </p>
          </div>

          <div className="mb-8 flex items-center gap-3 rounded-2xl bg-blue-50 p-4 text-blue-700">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <p className="text-xs font-medium leading-relaxed">
              This setup page is typically only used during initial deployment
              to create the root administrator.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@immagreat.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-medium outline-none transition focus:border-[#C52D2F] focus:ring-4 focus:ring-[#C52D2F]/5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-medium outline-none transition focus:border-[#C52D2F] focus:ring-4 focus:ring-[#C52D2F]/5"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-center text-xs font-semibold text-red-600 border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C52D2F] py-4 text-sm font-bold text-white shadow-[0_12px_24px_-8px_rgba(197,45,47,0.4)] transition hover:-translate-y-0.5 hover:bg-[#a92325] active:translate-y-0 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4" /> Create Admin Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
