"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type ViewMode = "day" | "week" | "month";

type Classroom = {
  id: string;
  title: string;
  teacherEmail: string;
  createdAtMs: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  days?: boolean[]; // Sun..Sat
};

type EventInstance = {
  classroomId: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
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

function yyyyMmDd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseYmd(ymd: string): Date {
  // Safe parse for YYYY-MM-DD
  const [y, m, d] = ymd.split("-").map((n) => Number(n));
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function startOfWeek(d: Date): Date {
  // Sunday start
  const x = new Date(d);
  const dow = x.getDay();
  x.setDate(x.getDate() - dow);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfMonth(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayLabel(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

function monthLabel(d: Date) {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function dayNumber(d: Date) {
  return d.getDate();
}

function generateEventsForRange(
  classrooms: Classroom[],
  rangeStart: Date,
  rangeEnd: Date
): EventInstance[] {
  const events: EventInstance[] = [];

  for (const c of classrooms) {
    if (!c.startDate || !c.endDate || !c.startTime || !c.endTime || !c.days) continue;

    const periodStart = parseYmd(c.startDate);
    const periodEnd = parseYmd(c.endDate);

    // intersect ranges
    const start = rangeStart.getTime() > periodStart.getTime() ? rangeStart : periodStart;
    const end = rangeEnd.getTime() < periodEnd.getTime() ? rangeEnd : periodEnd;

    // If no overlap
    if (start.getTime() > end.getTime()) continue;

    // Iterate day-by-day for MVP (fine for week/month).
    let cur = new Date(start);
    cur.setHours(0, 0, 0, 0);

    const last = new Date(end);
    last.setHours(0, 0, 0, 0);

    while (cur.getTime() <= last.getTime()) {
      const dow = cur.getDay();
      if (c.days[dow]) {
        events.push({
          classroomId: c.id,
          title: c.title,
          date: yyyyMmDd(cur),
          startTime: c.startTime,
          endTime: c.endTime,
        });
      }
      cur = addDays(cur, 1);
    }
  }

  // Sort: date then time
  events.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  return events;
}

export default function StudentCalendarPage() {
  const [view, setView] = useState<ViewMode>("week");
  const [anchor, setAnchor] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [classrooms] = useState<Classroom[]>(() => {
    if (typeof window === "undefined") return [];
    return loadClassrooms();
  });

  const range = useMemo(() => {
    if (view === "day") {
      return { start: anchor, end: anchor };
    }
    if (view === "week") {
      const start = startOfWeek(anchor);
      const end = addDays(start, 6);
      return { start, end };
    }
    // month
    const start = startOfMonth(anchor);
    const end = endOfMonth(anchor);
    return { start, end };
  }, [anchor, view]);

  const events = useMemo(() => {
    return generateEventsForRange(classrooms, range.start, range.end);
  }, [classrooms, range.end, range.start]);

  function prev() {
    setAnchor((d) => {
      if (view === "day") return addDays(d, -1);
      if (view === "week") return addDays(d, -7);
      return new Date(d.getFullYear(), d.getMonth() - 1, 1);
    });
  }

  function next() {
    setAnchor((d) => {
      if (view === "day") return addDays(d, 1);
      if (view === "week") return addDays(d, 7);
      return new Date(d.getFullYear(), d.getMonth() + 1, 1);
    });
  }

  const headerTitle = useMemo(() => {
    if (view === "day") return anchor.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    if (view === "week") {
      const s = range.start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      const e = range.end.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      return `Week: ${s} – ${e}`;
    }
    return monthLabel(anchor);
  }, [anchor, range.end, range.start, view]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#FFF0F0] p-3 text-[#C52D2F]">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">Calendar</p>
              <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">Your schedule</h1>
              <p className="mt-2 text-sm text-[#808080]">Switch views: daily, weekly, monthly.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-[#E6E6E6] bg-white p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setView("day")}
                className={`rounded-full px-3 py-2 transition ${view === "day" ? "bg-[#C52D2F] text-white" : "text-[#4D4D4D]"}`}

              >
                Day
              </button>
              <button
                type="button"
                onClick={() => setView("week")}
                className={`rounded-full px-3 py-2 transition ${view === "week" ? "bg-[#C52D2F] text-white" : "text-[#4D4D4D]"}`}

              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setView("month")}
                className={`rounded-full px-3 py-2 transition ${view === "month" ? "bg-[#C52D2F] text-white" : "text-[#4D4D4D]"}`}

              >
                Month
              </button>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full border border-[#E6E6E6] bg-white p-1">
              <button
                type="button"
                onClick={prev}
                className="rounded-full px-3 py-2 text-xs font-semibold text-[#4D4D4D] transition hover:text-[#C52D2F]"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="px-2 text-xs font-semibold text-[#4D4D4D]">{headerTitle}</div>
              <button
                type="button"
                onClick={next}
                className="rounded-full px-3 py-2 text-xs font-semibold text-[#4D4D4D] transition hover:text-[#C52D2F]"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <Link
              href="/students/classroom"
              className="rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
            >
              Classroom
            </Link>
          </div>
        </div>
      </section>

      {view === "month" ? (
        <MonthView
          anchor={anchor}
          events={events}
          onPickDate={(d) => {
            setAnchor(d);
            setView("day");
          }}
        />
      ) : view === "week" ? (
        <WeekView
          start={range.start}
          events={events}
          onPickDate={(d) => {
            setAnchor(d);
            setView("day");
          }}
        />
      ) : (
        <DayView date={anchor} events={events} />
      )}

      <p className="text-xs text-[#808080]">
        MVP: schedule is derived from locally stored classrooms. Next: pull from Postgres + enrollment, and show only classes you are assigned to.
      </p>
    </div>
  );
}

function DayView({ date, events }: { date: Date; events: EventInstance[] }) {
  const ymd = yyyyMmDd(date);
  const list = events.filter((e) => e.date === ymd);

  const startMinutes = 6 * 60;
  const endMinutes = 22 * 60;
  const slots = [] as { label: string; key: string }[];

  for (let m = startMinutes; m <= endMinutes; m += 30) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    slots.push({ label: `${hh}:${mm}`, key: `${hh}:${mm}` });
  }

  const byStart = new Map<string, EventInstance[]>();
  for (const e of list) {
    const l = byStart.get(e.startTime) ?? [];
    l.push(e);
    byStart.set(e.startTime, l);
  }

  return (
    <section className="rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">{ymd}</p>
      <h2 className="mt-1 text-xl font-semibold text-[#4D4D4D]">{date.toLocaleDateString(undefined, { weekday: "long" })}</h2>

      <div className="mt-6 overflow-hidden rounded-3xl border border-[#E6E6E6]">
        <div className="max-h-[520px] overflow-auto bg-white">
          {slots.map((s) => {
            const eventsAt = byStart.get(s.key) ?? [];
            return (
              <div key={s.key} className="flex border-b border-[#F0F0F0]">
                <div className="w-20 shrink-0 border-r border-[#F0F0F0] px-4 py-3 text-xs font-semibold text-[#808080]">
                  {s.label}
                </div>
                <div className="flex-1 px-4 py-3">
                  {eventsAt.length === 0 ? (
                    <div className="h-6" />
                  ) : (
                    <div className="space-y-2">
                      {eventsAt.map((e) => (
                        <Link
                          key={`${e.classroomId}-${e.startTime}`}
                          href={`/students/classroom/${e.classroomId}`}
                          className="block rounded-2xl border border-[#E6E6E6] bg-[#FFF8F8] p-3 hover:border-[#C52D2F]"
                        >
                          <p className="text-sm font-semibold text-[#4D4D4D]">{e.title}</p>
                          <p className="mt-1 text-xs text-[#808080]">{e.startTime}–{e.endTime}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {list.length === 0 ? (
        <p className="mt-4 text-sm text-[#808080]">No classes scheduled.</p>
      ) : null}
    </section>
  );
}

function WeekView({
  start,
  events,
  onPickDate,
}: {
  start: Date;
  events: EventInstance[];
  onPickDate: (d: Date) => void;
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const byDate = new Map<string, EventInstance[]>();
  for (const e of events) {
    const list = byDate.get(e.date) ?? [];
    list.push(e);
    byDate.set(e.date, list);
  }

  return (
    <section className="rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] md:p-8">
      <div className="grid gap-3 md:grid-cols-7">
        {days.map((d) => {
          const ymd = yyyyMmDd(d);
          const list = byDate.get(ymd) ?? [];
          return (
            <div key={ymd} className="rounded-2xl border border-[#E6E6E6] bg-white p-3">
              <button
                type="button"
                onClick={() => onPickDate(d)}
                className="w-full text-left"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">{dayLabel(d)}</p>
                <p className="text-lg font-semibold text-[#4D4D4D]">{dayNumber(d)}</p>
              </button>
              <div className="mt-2 space-y-2">
                {list.length === 0 ? (
                  <p className="text-xs text-[#808080]">—</p>
                ) : (
                  list.slice(0, 4).map((e) => (
                    <Link
                      key={`${e.classroomId}-${e.startTime}`}
                      href={`/students/classroom/${e.classroomId}`}
                      className="block rounded-xl border border-[#E6E6E6] bg-[#FFF8F8] p-2 text-xs hover:border-[#C52D2F]"
                    >
                      <p className="font-semibold line-clamp-1">{e.title}</p>
                      <p className="text-[11px] text-[#808080]">{e.startTime}</p>
                    </Link>
                  ))
                )}
                {list.length > 4 ? (
                  <p className="text-[11px] text-[#808080]">+{list.length - 4} more</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MonthView({
  anchor,
  events,
  onPickDate,
}: {
  anchor: Date;
  events: EventInstance[];
  onPickDate: (d: Date) => void;
}) {
  const start = startOfWeek(startOfMonth(anchor));
  const end = addDays(startOfWeek(endOfMonth(anchor)), 6);

  const days: Date[] = [];
  let cur = new Date(start);
  while (cur.getTime() <= end.getTime()) {
    days.push(new Date(cur));
    cur = addDays(cur, 1);
  }

  const byDate = new Map<string, number>();
  for (const e of events) {
    byDate.set(e.date, (byDate.get(e.date) ?? 0) + 1);
  }

  const monthIdx = anchor.getMonth();

  return (
    <section className="rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] md:p-8">
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#808080]">
            {d}
          </div>
        ))}

        {days.map((d) => {
          const ymd = yyyyMmDd(d);
          const count = byDate.get(ymd) ?? 0;
          const isOtherMonth = d.getMonth() !== monthIdx;

          return (
            <button
              key={ymd}
              type="button"
              onClick={() => onPickDate(d)}
              className={`h-24 rounded-2xl border border-[#E6E6E6] p-2 text-left transition hover:border-[#C52D2F] ${
                isOtherMonth ? "bg-white/60 opacity-60" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-[#4D4D4D]">{dayNumber(d)}</p>
                {count > 0 ? (
                  <span className="rounded-full bg-[#C52D2F] px-2 py-0.5 text-[11px] font-semibold text-white">
                    {count}
                  </span>
                ) : null}
              </div>
              {count > 0 ? (
                <p className="mt-2 text-[11px] text-[#808080]">classes</p>
              ) : (
                <p className="mt-2 text-[11px] text-[#B0B0B0]">—</p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
