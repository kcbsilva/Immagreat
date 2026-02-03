"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Plus,
  Video,
  X,
  Users,
  ShieldCheck,
} from "lucide-react";

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
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  days: boolean[]; // 0..6 Sun..Sat
  enrolledStudentEmails?: string[];
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

export default function TeacherClassroomsPage() {
  const router = useRouter();

  const [teacherEmail] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("immagreat_teacher_email");
  });

  const [{ startDate: defaultStart, endDate: defaultEnd }] = useState(() =>
    defaultJan1Dec31()
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("ImmaGreat - Y26 - English - C1");
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [days, setDays] = useState<boolean[]>(() =>
    // Mon-Fri
    [false, true, true, true, true, true, false]
  );
  const [studentEmails, setStudentEmails] = useState("");

  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    if (typeof window === "undefined") return [];
    return loadClassrooms();
  });

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

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function createClassroom() {
    if (!teacherEmail) return;

    const id = makeRoomId();

    const enrolledStudentEmails = studentEmails
      .split(/[,\n]/g)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

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
      enrolledStudentEmails: enrolledStudentEmails.length ? enrolledStudentEmails : [],
    };

    const next = [newRoom, ...classrooms];
    setClassrooms(next);
    saveClassrooms(next);

    setStudentEmails("");
    closeModal();
    router.push(`/teachers/classroom/${id}`);
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
            Classrooms
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
            Manage your classes
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#808080]">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E6E6] bg-white px-3 py-1">
              <Users className="h-3.5 w-3.5 text-[#C52D2F]" />
              Up to 10 students • 2 teachers • 1 moderator
            </span>
            <span className="rounded-full bg-[#FFF5F5] px-3 py-1">
              Teacher creates, students are assigned (no invites)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center gap-2 rounded-full bg-[#C52D2F] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(197,45,47,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a92325]"
          >
            <Plus className="h-4 w-4" /> Add classroom
          </button>
          <Link
            href="/students/classroom"
            className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-5 py-3 text-sm font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
          >
            <Video className="h-4 w-4" /> Student view
          </Link>
        </div>
      </section>

      <section className="space-y-3">
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
                <div
                  key={c.id}
                  className="rounded-2xl border border-[#E6E6E6] bg-white p-5 shadow-lg shadow-black/10"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-[#808080]">
                    {new Date(c.createdAtMs).toLocaleString()}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{c.title}</p>
                  <p className="mt-2 text-xs text-[#808080]">{summary}</p>
                  <p className="mt-2 text-xs font-mono text-[#808080]">{c.id}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/teachers/classroom/${c.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#C52D2F] px-4 py-2 text-xs font-semibold text-white"
                    >
                      Open classroom
                      <ArrowRight className="h-4 w-4" />
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

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />
          <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
                  Add classroom
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-[#4D4D4D]">
                  Classroom details
                </h2>
                <div className="mt-2 flex items-center gap-2 text-xs text-[#808080]">
                  <ShieldCheck className="h-4 w-4 text-[#C52D2F]" />
                  Title only for students; schedule is internal.
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-[#E6E6E6] p-2 text-[#4D4D4D] hover:border-[#C52D2F] hover:text-[#C52D2F]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ImmaGreat - Y26 - English - C1"
                  className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 text-sm outline-none"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">Students (emails)</span>
                <textarea
                  value={studentEmails}
                  onChange={(e) => setStudentEmails(e.target.value)}
                  placeholder="student1@email.com, student2@email.com"
                  className="min-h-[96px] w-full rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 text-sm outline-none"
                />
                <p className="text-xs text-[#808080]">Comma or newline separated. Only these students will see this class on their calendar.</p>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">Period start</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">Period end</span>
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
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">Start time</span>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">End time</span>
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
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">Days</p>
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
                <p className="mt-3 text-xs text-[#808080]">{scheduleSummary}</p>
              </div>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center justify-center rounded-full border border-[#E6E6E6] bg-white px-5 py-3 text-sm font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createClassroom}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C52D2F] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(197,45,47,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a92325]"
                >
                  <Plus className="h-4 w-4" /> Create classroom
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
