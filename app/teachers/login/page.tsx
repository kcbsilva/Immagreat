"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  GraduationCap,
  Mail,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user?.role === "TEACHER" || data.user?.role === "ADMIN") {
          router.replace("/teachers/dashboard");
        }
      }
    };
    checkSession();
  }, [router]);

  const canSubmit = useMemo(
    () => email.trim().length > 3 && password.length >= 6,
    [email, password],
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user.role === "TEACHER" || data.user.role === "ADMIN") {
          router.push("/teachers/dashboard");
        } else {
          setError("You do not have teacher privileges.");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#FFF0F0] p-3 text-[#C52D2F]">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
              Teacher Portal
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-[#808080]">
              Create classrooms and go live.
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">
              Email
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 focus-within:border-[#C52D2F] transition-colors">
              <Mail className="h-4 w-4 text-[#9A9A9A]" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="teacher@immagreat.com"
                className="w-full bg-transparent text-sm outline-none"
                required
              />
            </div>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">
              Password
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 focus-within:border-[#C52D2F] transition-colors">
              <div className="h-4 w-4 flex items-center justify-center text-[#9A9A9A] font-bold text-xs">
                P
              </div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none"
                required
              />
            </div>
          </label>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-center text-xs font-semibold text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div className="mt-2">
            <button
              type="submit"
              disabled={!canSubmit || isLoading}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#C52D2F] px-5 py-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(197,45,47,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a92325] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      <aside className="rounded-3xl border border-[#E6E6E6] bg-gradient-to-b from-white via-white to-[#FFF5F5] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
          Teacher Access
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="rounded-2xl border border-[#E6E6E6] bg-white p-4 shadow-sm">
            <p className="font-semibold text-[#4D4D4D]">
              Secure Authentication
            </p>
            <p className="text-xs text-[#808080] mt-1">
              We've migrated from localStorage to secure session-based
              authentication.
            </p>
          </li>
          <li className="rounded-2xl border border-[#E6E6E6] bg-white p-4 shadow-sm">
            <p className="font-semibold text-[#4D4D4D]">Classroom Control</p>
            <p className="text-xs text-[#808080] mt-1">
              Only verified teachers can create and manage live sessions.
            </p>
          </li>
        </ul>
      </aside>
    </div>
  );
}
