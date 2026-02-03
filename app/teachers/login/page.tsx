"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, GraduationCap, Mail, Sparkles } from "lucide-react";

const DEMO_TEACHER_EMAIL = "demo.teacher@immagreat.local";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("immagreat_teacher_email");
    if (stored) router.replace("/teachers/dashboard");
  }, [router]);

  const canSubmit = useMemo(() => email.trim().length > 3, [email]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("immagreat_teacher_email", email.trim());
    router.push("/teachers/dashboard");
  }

  function loginDemo() {
    localStorage.setItem("immagreat_teacher_email", DEMO_TEACHER_EMAIL);
    router.push("/teachers/dashboard");
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#FFF0F0] p-3 text-[#C52D2F]">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">Teacher Portal</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">Sign in</h1>
            <p className="mt-2 text-sm text-[#808080]">Create classrooms and go live.</p>
          </div>
        </div>

        <form onSubmit={login} className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">Email</span>
            <div className="flex items-center gap-2 rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3">
              <Mail className="h-4 w-4 text-[#9A9A9A]" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder={DEMO_TEACHER_EMAIL}
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
              Demo teacher
            </button>
          </div>

          <p className="text-xs text-[#808080]">Demo creates <span className="font-mono">{DEMO_TEACHER_EMAIL}</span> in localStorage.</p>
        </form>
      </section>

      <aside className="rounded-3xl border border-[#E6E6E6] bg-gradient-to-b from-white via-white to-[#FFF5F5] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">MVP Notes</p>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="rounded-2xl border border-[#E6E6E6] bg-white p-4">
            <p className="font-semibold">Teacher creates the room</p>
            <p className="text-xs text-[#808080]">Students join by link/code.</p>
          </li>
          <li className="rounded-2xl border border-[#E6E6E6] bg-white p-4">
            <p className="font-semibold">Students watch</p>
            <p className="text-xs text-[#808080]">Video-focused, chat on the right.</p>
          </li>
        </ul>
      </aside>
    </div>
  );
}
