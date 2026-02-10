"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function StudentLoginPage() {
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
        if (data.user?.role === "STUDENT" || data.user?.role === "ADMIN") {
          router.replace("/students/dashboard");
        }
      }
    };
    checkSession();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user?.role !== "STUDENT") {
          setError("This portal is for students only.");
          return;
        }
        router.push("/students/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] max-w-5xl mx-auto py-12">
      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#FFF0F0] p-3 text-[#C52D2F]">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
              Student Portal
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
              Sign in to your dashboard
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600 border border-red-100 italic">
              {error}
            </div>
          )}

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">
              Email Address
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 focus-within:border-[#C52D2F] transition">
              <Mail className="h-4 w-4 text-[#9A9A9A]" />
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="student@email.com"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">
              Password
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 focus-within:border-[#C52D2F] transition">
              <Lock className="h-4 w-4 text-[#9A9A9A]" />
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="group mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#C52D2F] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-[#C52D2F]/30 transition hover:-translate-y-0.5 hover:bg-[#a92325] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Sign in Access
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </section>

      <aside className="rounded-3xl border border-[#E6E6E6] bg-gradient-to-b from-white via-white to-[#FFF5F5] p-8 flex flex-col justify-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
          Safe & Secure
        </p>
        <p className="mt-2 text-sm text-[#4D4D4D] leading-relaxed">
          Access your personal education record, class schedules, and
          translations platform.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-[#E6E6E6] text-[#C52D2F] font-bold text-xs ring-4 ring-[#FFF5F5]">
              01
            </div>
            <span className="text-xs font-bold text-[#4D4D4D] uppercase tracking-wider">
              Review Schedule
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-[#E6E6E6] text-[#C52D2F] font-bold text-xs ring-4 ring-[#FFF5F5]">
              02
            </div>
            <span className="text-xs font-bold text-[#4D4D4D] uppercase tracking-wider">
              Attend Classes
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
