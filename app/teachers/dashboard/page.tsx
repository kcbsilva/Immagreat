"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, LogOut, Users, Video, Loader2 } from "lucide-react";

type Classroom = {
  id: string;
  title: string;
  teacherEmail: string;
  createdAtMs: number;
};

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [teacherEmail, setTeacherEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/teachers/login");
          return;
        }
        const data = await res.json();
        if (data.user?.role !== "TEACHER" && data.user?.role !== "ADMIN") {
          router.push("/landing");
          return;
        }
        setTeacherEmail(data.user.email);
        // Sync email to localStorage for any remaining legacy components
        localStorage.setItem("immagreat_teacher_email", data.user.email);
      } catch (err) {
        router.push("/teachers/login");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("immagreat_teacher_email");
      router.push("/teachers/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#C52D2F]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
            Teacher
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-[#808080]">
            Signed in as{" "}
            <span className="font-bold text-[#4D4D4D]">{teacherEmail}</span>
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C52D2F] text-white font-bold text-lg shadow-lg shadow-[#C52D2F]/20">
          {teacherEmail?.[0].toUpperCase() || "T"}
        </div>
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
          icon={<Users className="h-5 w-5" />}
          title="Students"
          body="View students enrolled in your classes."
          cta="View directory"
          href="/teachers/students"
        />
      </section>
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
