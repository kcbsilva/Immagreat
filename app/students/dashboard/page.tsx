"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  FileText,
  GraduationCap,
  Headphones,
  LogOut,
  MessageCircle,
  Upload,
  Video,
} from "lucide-react";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [email] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("immagreat_student_email");
  });

  useEffect(() => {
    if (!email) router.replace("/students/login");
  }, [email, router]);

  const firstName = useMemo(() => {
    if (!email) return "Student";
    const left = email.split("@")[0] ?? "student";
    return left.split(".")[0]?.slice(0, 1).toUpperCase() + left.split(".")[0]?.slice(1);
  }, [email]);

  function logout() {
    localStorage.removeItem("immagreat_student_email");
    router.push("/students/login");
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
            Welcome back
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
            {firstName}’s Dashboard
          </h1>
          <p className="mt-2 text-sm text-[#808080]">
            {email ? `Signed in as ${email}` : "Loading…"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/landing#intake"
            className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
          >
            <MessageCircle className="h-4 w-4" />
            Contact support
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full bg-[#C52D2F] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(197,45,47,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a92325]"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          icon={<GraduationCap className="h-5 w-5" />}
          title="My Classes"
          body="Your current program modules, homework, and resources."
          cta="Open classes"
        />
        <Card
          icon={<Video className="h-5 w-5" />}
          title="Classroom"
          body="Join your live video sessions with your teacher."
          cta="Enter classroom"
          href="/students/classroom"
        />
        <Card
          icon={<Calendar className="h-5 w-5" />}
          title="Schedule"
          body="Upcoming sessions, attendance, and reminders."
          cta="View schedule"
        />
        <Card
          icon={<FileText className="h-5 w-5" />}
          title="Documents"
          body="Upload documents for translation and track progress."
          cta="Manage documents"
        />
        <Card
          icon={<Upload className="h-5 w-5" />}
          title="Uploads"
          body="Drop files here (MVP placeholder)."
          cta="Upload file"
        />
        <Card
          icon={<Headphones className="h-5 w-5" />}
          title="Support"
          body="Need help? Get quick answers or request a call."
          cta="Get help"
        />
      </section>

      <p className="text-xs text-[#808080]">
        MVP note: this portal UI is in place; next step is real authentication +
        student data (classes, schedule, documents) backed by a database.
      </p>
    </div>
  );
}

function Card({
  icon,
  title,
  body,
  cta,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  href?: string;
}) {
  const Button = (
    <span className="mt-2 inline-flex items-center rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]">
      {cta}
    </span>
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E6E6E6] bg-white p-5 shadow-lg shadow-black/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F5] via-transparent to-transparent opacity-80" />
      <div className="relative flex items-start gap-3">
        <div className="rounded-xl bg-[#FFF0F0] p-3 text-[#C52D2F]">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#4D4D4D]">{title}</h3>
          <p className="text-sm text-[#808080]">{body}</p>
          {href ? (
            <Link href={href} className="inline-flex">
              {Button}
            </Link>
          ) : (
            <button type="button" className="inline-flex">
              {Button}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
