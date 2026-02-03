"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, LogOut, Plus, Video } from "lucide-react";

function makeRoomId() {
  return (
    Math.random().toString(36).slice(2, 8) +
    "-" +
    Math.random().toString(36).slice(2, 6)
  );
}

function defaultJan1Dec31() {
  const year = new Date().getFullYear();
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  return { startDate, endDate };
}

type Classroom = {
  id: string;
  title: string;
  teacherEmail: string;
  createdAtMs: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  days: boolean[]; // 0..6 (Sun..Sat)
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

function saveClassrooms(items: Classroom[]) {
  localStorage.setItem("immagreat_classrooms", JSON.stringify(items));
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export default function TeacherDashboardPage() {
  const router = useRouter();

  const [teacherEmail] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("immagreat_teacher_email");
  });

  const [{ startDate: defaultStart, endDate: defaultEnd }] = useState(() =>
    defaultJan1Dec31()
  );

  const [title, setTitle] = useState("ImmaGreat - Y26 - English - C1");
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [days, setDays] = useState<boolean[]>(() => [false, true, true, true, true, true, false]); // Mon-Fri

  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    if (typeof window === "undefined") return [];
    return loadClassrooms();
  });

  useEffect(() => {
    if (!teacherEmail) router.replace("/teachers/login");
  }, [teacherEmail, router]);

  const mine = useMemo(() => {
    if (!teacherEmail) return [];
    return classrooms.filter((c) => c.teacherEmail === teacherEmail);
  }, [classrooms, teacherEmail]);

  const scheduleSummary = useMemo(() => {
    const selected = dayLabels
      .map((d, i) => (days[i] ? d : null))
      .filter(Boolean)
      .join(", ");
    return `${selected || "No days"} • ${startTime}–${endTime} • ${startDate} → ${endDate}`;
  }, [days, startDate, endDate, startTime, endTime]);

  function toggleDay(index: number) {
    setDays((prev) => {
      const next = prev.slice();
      next[index] = !next[index];
      return next;
    });
  }

  function createRoom() {
    if (!teacherEmail) return;
    const id = makeRoomId();

    const newRoom: Classroom = {
      id,
      title: title.trim() || "ImmaGreat - Classroom",
      teacherEmail,
      createdAtMs: Date.now(),
      startDate,
      endDate,
      startTime,
      endTime,
      days,
    };

    const next = [newRoom, ...classrooms];
    setClassrooms(next);
    saveClassrooms(next);
    router.push(`/teachers/classroom/${id}`);
  }

  function logout() {
    localStorage.removeItem("immagreat_teacher_email");
    router.push("/teachers/login");
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
            {teacherEmail ? `Signed in as ${teacherEmail}` : "Loading…"}
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full bg-[#C52D2F] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(197,45,47,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a92325]"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>

      <section className="grid gap-6 rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.05)] md:grid-cols-[1fr_1.1fr]">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[#808080]">
            Create classroom
          </p>
          <h2 className="text-2xl font-semibold text-[#4D4D4D]">Go live</h2>
          <p className="text-sm text-[#808080]">
            Students are placed into the classroom (no invite links). Video-focused with chat on the right.
          </p>
        </div>

        <div className="space-y-4">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">
              Title
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ImmaGreat - Y26 - English - C1"
              className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 text-sm outline-none"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">
                Period start
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">
                Period end
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 text-sm outline-none"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">
                Start time
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">
                End time
              </span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 text-sm outline-none"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-[#E6E6E6] bg-[#FFF8F8] p-4">
            <div className="flex items-center gap-2 text-[#C52D2F]">
              <CalendarDays className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">
                Days
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {dayLabels.map((d, i) => (
                <label
                  key={d}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                    days[i]
                      ? "border-[#C52D2F] bg-[#C52D2F] text-white"
                      : "border-[#E6E6E6] bg-white text-[#4D4D4D] hover:border-[#C52D2F]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={days[i]}
                    onChange={() => toggleDay(i)}
                    className="sr-only"
                  />
                  {d}
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#808080]">
              {scheduleSummary}
            </p>
          </div>

          <button
            type="button"
            onClick={createRoom}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C52D2F] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(197,45,47,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a92325]"
          >
            <Plus className="h-4 w-4" /> Create classroom
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My classrooms</h2>
          <Link
            href="/students/classroom"
            className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
          >
            <Video className="h-4 w-4" /> Student join page
          </Link>
        </div>

        {mine.length === 0 ? (
          <p className="text-sm text-[#808080]">No classrooms yet.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {mine.map((c) => {
              const selected = dayLabels
                .map((d, i) => (c.days?.[i] ? d : null))
                .filter(Boolean)
                .join(", ");
              const summary = `${selected || "No days"} • ${c.startTime}–${c.endTime} • ${c.startDate} → ${c.endDate}`;

              return (
                <div key={c.id} className="rounded-2xl border border-[#E6E6E6] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#808080]">
                    {new Date(c.createdAtMs).toLocaleString()}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{c.title}</p>
                  <p className="mt-2 text-xs text-[#808080]">{summary}</p>
                  <p className="mt-2 text-xs text-[#808080] font-mono">{c.id}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/teachers/classroom/${c.id}`}
                      className="inline-flex items-center rounded-full bg-[#C52D2F] px-4 py-2 text-xs font-semibold text-white"
                    >
                      Open
                    </Link>
                    <Link
                      href={`/students/classroom/${c.id}`}
                      className="inline-flex items-center rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D]"
                    >
                      Student view
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
