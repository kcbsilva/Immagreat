"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, Clock, Video } from "lucide-react";

type Classroom = {
  id: string;
  title: string;
  teacherEmail: string;
  createdAtMs: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  days: boolean[];
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

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function fmtDays(days: boolean[]) {
  const selected = dayLabels
    .map((d, i) => (days?.[i] ? d : null))
    .filter(Boolean)
    .join(", ");
  return selected || "No days";
}

export default function TeacherCalendarPage() {
  const [teacherEmail] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("immagreat_teacher_email");
  });

  const [classrooms] = useState<Classroom[]>(() => {
    if (typeof window === "undefined") return [];
    return loadClassrooms();
  });

  const mine = useMemo(() => {
    if (!teacherEmail) return [];
    return classrooms
      .filter((c) => c.teacherEmail === teacherEmail)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [classrooms, teacherEmail]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#FFF0F0] p-3 text-[#C52D2F]">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
              Calendar
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
              Scheduled classes
            </h1>
            <p className="mt-2 text-sm text-[#808080]">
              This shows the weekly schedule for all your classrooms (MVP view).
            </p>
          </div>
        </div>
      </section>

      {mine.length === 0 ? (
        <p className="text-sm text-[#808080]">No classrooms found.</p>
      ) : (
        <div className="space-y-3">
          {mine.map((c) => (
            <div
              key={c.id}
              className="rounded-3xl border border-[#E6E6E6] bg-white p-5 shadow-lg shadow-black/10"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-[#4D4D4D]">{c.title}</p>
                  <p className="mt-2 text-xs text-[#808080]">
                    {c.startDate} → {c.endDate}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#808080]">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E6E6] bg-white px-3 py-1">
                      <CalendarDays className="h-3.5 w-3.5 text-[#C52D2F]" />
                      {fmtDays(c.days)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E6E6] bg-white px-3 py-1">
                      <Clock className="h-3.5 w-3.5 text-[#C52D2F]" />
                      {c.startTime}–{c.endTime}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/teachers/classroom/${c.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#C52D2F] px-4 py-2 text-xs font-semibold text-white"
                  >
                    <Video className="h-4 w-4" /> Open
                  </Link>
                  <Link
                    href={`/students/classroom/${c.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D]"
                  >
                    Student view
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-[#808080]">
        Next: calendar grid (week view) + conflict detection + per-date session instances.
      </p>
    </div>
  );
}
