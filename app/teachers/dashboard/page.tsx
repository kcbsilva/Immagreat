"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, LogOut, Users, Video } from "lucide-react";

type Classroom = {
  id: string;
  title: string;
  teacherEmail: string;
  createdAtMs: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  days?: boolean[];
};

function loadClassrooms(): Classroom[] {
  try {
    const raw = localStorage.getItem("immagreat_classrooms");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Classroom[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function TeacherDashboardPage() {
  const router = useRouter();

  const [teacherEmail] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("immagreat_teacher_email");
  });

  useEffect(() => {
    if (!teacherEmail) router.replace("/teachers/login");
  }, [teacherEmail, router]);

  const [classrooms] = useState<Classroom[]>(() => {
    if (typeof window === "undefined") return [];
    return loadClassrooms();
  });

  const mine = useMemo(() => {
    if (!teacherEmail) return [];
    return classrooms.filter((c) => c.teacherEmail === teacherEmail);
  }, [classrooms, teacherEmail]);

  function logout() {
    localStorage.removeItem("immagreat_teacher_email");
    router.push("/teachers/login");
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">Teacher</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">Dashboard</h1>
          <p className="mt-2 text-sm text-[#808080]">{teacherEmail ? `Signed in as ${teacherEmail}` : "Loading…"}</p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full bg-[#C52D2F] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(197,45,47,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a92325]"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          icon={<Users className="h-5 w-5" />}
          title="Classrooms"
          body="Create and manage your classroom list."
          cta="Open classrooms"
          href="/teachers/classrooms"
        />
        <Card
          icon={<CalendarDays className="h-5 w-5" />}
          title="Calendar"
          body="Day / week / month schedule with 30-minute slots."
          cta="Open calendar"
          href="/teachers/calendar"
        />
        <Card
          icon={<Video className="h-5 w-5" />}
          title="Go live"
          body={mine.length > 0 ? "Open your latest classroom session." : "Create a classroom first."}
          cta={mine.length > 0 ? "Open latest" : "Create classroom"}
          href={mine.length > 0 ? `/teachers/classroom/${mine[0]?.id}` : "/teachers/classrooms"}
        />
      </section>

      <p className="text-xs text-[#808080]">
        MVP note: teacher auth is localStorage for now; we’ll migrate to email/password + Postgres.
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
  href: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E6E6E6] bg-white p-5 shadow-lg shadow-black/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F5] via-transparent to-transparent opacity-80" />
      <div className="relative flex items-start gap-3">
        <div className="rounded-xl bg-[#FFF0F0] p-3 text-[#C52D2F]">{icon}</div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#4D4D4D]">{title}</h3>
          <p className="text-sm text-[#808080]">{body}</p>
          <Link
            href={href}
            className="mt-2 inline-flex items-center rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
          >
            {cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
