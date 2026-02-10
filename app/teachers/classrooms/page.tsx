"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Plus,
  Video,
  X,
  Users,
  ShieldCheck,
  Loader2,
} from "lucide-react";

type Classroom = {
  id: string;
  title: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  days: number[];
  enrollments?: { user: { email: string } }[];
};

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export default function TeacherClassroomsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("ImmaGreat - Y26 - English - C1");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), 11, 31).toISOString().split("T")[0],
  );
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [days, setDays] = useState<boolean[]>(() => [
    false,
    true,
    true,
    true,
    true,
    true,
    false,
  ]);
  const [studentEmails, setStudentEmails] = useState("");

  const fetchClassrooms = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/teachers/classrooms");
      const data = await res.json();
      if (data.classrooms) {
        setClassrooms(data.classrooms);
      }
    } catch (err) {
      console.error("Failed to fetch classrooms", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const scheduleSummary = useMemo(() => {
    const selected = dayLabels
      .map((d, i) => (days[i] ? d : null))
      .filter(Boolean)
      .join(", ");
    return `${selected || "No days"} • ${startTime}–${endTime} • ${startDate} → ${endDate}`;
  }, [days, startDate, endDate, startTime, endTime]);

  function toggleDay(index: number) {
    setDays((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  async function createClassroom() {
    setIsSubmitting(true);
    const emails = studentEmails
      .split(/[,\n]/g)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    try {
      const res = await fetch("/api/teachers/classrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          startDate,
          endDate,
          startTime,
          endTime,
          days,
          studentEmails: emails,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsModalOpen(false);
        fetchClassrooms();
        router.push(`/teachers/classroom/${data.classroom.id}`);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create classroom");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
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
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#C52D2F] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(197,45,47,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a92325]"
          >
            <Plus className="h-4 w-4" /> Add classroom
          </button>
        </div>
      </section>

      <section className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#C52D2F]" />
          </div>
        ) : classrooms.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#E6E6E6] p-12 text-center">
            <p className="text-sm text-[#808080]">
              No classrooms yet. Start by creating your first session.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {classrooms.map((c) => {
              const selected = dayLabels
                .map((d, i) => (c.days?.includes(i) ? d : null))
                .filter(Boolean)
                .join(", ");
              const summary = `${selected || "No days"} • ${c.startTime}–${c.endTime}`;

              return (
                <div
                  key={c.id}
                  className="group relative overflow-hidden rounded-2xl border border-[#E6E6E6] bg-white p-6 transition hover:shadow-xl hover:shadow-black/5"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Video className="h-16 w-16" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#808080]">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[#4D4D4D]">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-xs font-medium text-[#808080]">
                    {summary}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-[#C52D2F]">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      {c.enrollments?.length || 0} Students
                    </span>
                    <span className="h-1 w-1 rounded-full bg-[#E6E6E6]" />
                    <span className="text-[#808080]">Status: Active</span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Link
                      href={`/teachers/classroom/${c.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-black"
                    >
                      Open classroom
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-[#E6E6E6] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] overflow-hidden">
            <div className="bg-[#C52D2F] p-6 text-white text-center">
              <h2 className="text-xl font-bold uppercase tracking-widest">
                New Classroom
              </h2>
            </div>

            <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#808080]">
                  Title
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Class Name"
                  className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-5 py-3 text-sm outline-none focus:border-[#C52D2F]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#808080]">
                  Student Emails
                </span>
                <textarea
                  value={studentEmails}
                  onChange={(e) => setStudentEmails(e.target.value)}
                  placeholder="student1@email.com, student2@email.com"
                  className="min-h-[100px] w-full rounded-2xl border border-[#E6E6E6] bg-white px-5 py-3 text-sm outline-none focus:border-[#C52D2F]"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#808080]">
                    Start Date
                  </span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-5 py-3 text-sm outline-none"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#808080]">
                    End Date
                  </span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-5 py-3 text-sm outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#808080]">
                    Start Time
                  </span>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-5 py-3 text-sm outline-none"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#808080]">
                    End Time
                  </span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-5 py-3 text-sm outline-none"
                  />
                </label>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#808080]">
                  Weekly Schedule
                </span>
                <div className="flex flex-wrap gap-2">
                  {dayLabels.map((d, i) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(i)}
                      className={`rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
                        days[i]
                          ? "border-[#C52D2F] bg-[#C52D2F] text-white"
                          : "border-[#E6E6E6] bg-white text-[#4D4D4D] hover:border-[#C52D2F]"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-bold transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={createClassroom}
                  className="flex-[2] rounded-full bg-[#C52D2F] py-3 text-sm font-bold text-white shadow-lg shadow-[#C52D2F]/30 transition hover:bg-[#a92325] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Create Class
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
