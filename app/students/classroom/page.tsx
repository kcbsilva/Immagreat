"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Video } from "lucide-react";

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

export default function ClassroomHomePage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [studentEmail] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("immagreat_student_email")?.toLowerCase() ?? null;
  });
  const [classrooms] = useState<Classroom[]>(() => {
    if (typeof window === "undefined") return [];
    const all = loadClassrooms();
    if (!studentEmail) return [];
    return all.filter((c) =>
      (c.enrolledStudentEmails ?? [])
        .map((x) => String(x).toLowerCase())
        .includes(studentEmail)
    );
  });

  const canJoin = useMemo(() => roomId.trim().length >= 4, [roomId]);

  function joinRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!canJoin) return;
    router.push(`/students/classroom/${roomId.trim()}`);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#FFF0F0] p-3 text-[#C52D2F]">
            <Video className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">Classroom</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">Join your class</h1>
            <p className="mt-2 text-sm text-[#808080]">
              Teachers create the classroom. Students join and watch the live lesson, with chat on the right.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/students/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-5 py-3 text-sm font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
          >
            Back to dashboard
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
        <h2 className="text-lg font-semibold text-[#4D4D4D]">Join with code</h2>
        <form onSubmit={joinRoom} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter classroom code (e.g. ab12cd-ef34)"
            className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={!canJoin}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C52D2F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a92325] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Join
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-2 text-xs text-[#808080]">Tip: your teacher will assign you to a class. If you know your classroom code, you can also join directly.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#4D4D4D]">Recent classrooms (this device)</h2>
        {classrooms.length === 0 ? (
          <p className="text-sm text-[#808080]">No classrooms found on this device yet.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {classrooms.map((c) => {
              const days = c.days ?? [];
              const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              const selected = dayLabels
                .map((d, i) => (days[i] ? d : null))
                .filter(Boolean)
                .join(", ");
              const summary =
                c.startDate && c.endDate && c.startTime && c.endTime
                  ? `${selected || "No days"} • ${c.startTime}–${c.endTime} • ${c.startDate} → ${c.endDate}`
                  : null;

              return (
                <div key={c.id} className="rounded-2xl border border-[#E6E6E6] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#808080]">{new Date(c.createdAtMs).toLocaleString()}</p>
                  <p className="mt-1 text-lg font-semibold">{c.title}</p>
                  <p className="mt-2 text-xs text-[#808080]">Teacher: {c.teacherEmail}</p>
                  {summary ? (
                    <p className="mt-2 text-xs text-[#808080]">{summary}</p>
                  ) : null}
                  <p className="mt-2 text-xs font-mono text-[#808080]">{c.id}</p>
                  <button
                    type="button"
                    onClick={() => router.push(`/students/classroom/${c.id}`)}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#C52D2F] px-4 py-2 text-xs font-semibold text-white"
                  >
                    Join
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
