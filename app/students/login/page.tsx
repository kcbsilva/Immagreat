"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

const DEMO_EMAIL = "demo.student@immagreat.local";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // If a demo user already exists, jump straight to the dashboard.
    const stored = localStorage.getItem("immagreat_student_email");
    if (stored) router.replace("/students/dashboard");
  }, [router]);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.trim().length >= 3;
  }, [email, password]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // MVP only (no real auth): store the identity locally.
    localStorage.setItem("immagreat_student_email", email.trim());
    router.push("/students/dashboard");
  }

  function loginDemo() {
    localStorage.setItem("immagreat_student_email", DEMO_EMAIL);
    router.push("/students/dashboard");
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
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
            <p className="mt-2 text-sm text-[#808080]">
              Access your classes, schedules, documents, and support.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">
              Email
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3">
              <Mail className="h-4 w-4 text-[#9A9A9A]" />
              <input
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
            <div className="flex items-center gap-2 rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3">
              <Lock className="h-4 w-4 text-[#9A9A9A]" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </label>

          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#C52D2F] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(197,45,47,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a92325] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              Sign in
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={loginDemo}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-5 py-3 text-sm font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
            >
              <Sparkles className="h-4 w-4" />
              Demo user
            </button>
          </div>

          <p className="text-xs text-[#808080]">
            Demo user creates <span className="font-mono">{DEMO_EMAIL}</span> in localStorage.
          </p>

          <p className="text-xs text-[#808080]">
            MVP: this login is a placeholder (no real authentication yet).
          </p>
        </form>
      </section>

      <aside className="rounded-3xl border border-[#E6E6E6] bg-gradient-to-b from-white via-white to-[#FFF5F5] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
          What you’ll find inside
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="rounded-2xl border border-[#E6E6E6] bg-white p-4">
            <p className="font-semibold">My Classes</p>
            <p className="text-xs text-[#808080]">English program modules and homework.</p>
          </li>
          <li className="rounded-2xl border border-[#E6E6E6] bg-white p-4">
            <p className="font-semibold">Schedule</p>
            <p className="text-xs text-[#808080]">Upcoming sessions and reminders.</p>
          </li>
          <li className="rounded-2xl border border-[#E6E6E6] bg-white p-4">
            <p className="font-semibold">Documents</p>
            <p className="text-xs text-[#808080]">Upload + track translations and forms.</p>
          </li>
        </ul>
      </aside>
    </div>
  );
}
