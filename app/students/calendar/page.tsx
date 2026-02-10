"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

type ViewMode = "day" | "week" | "month";

type Classroom = {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  days: number[]; // 0..6
};

type EventInstance = {
  classroomId: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
};

function yyyyMmDd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseYmd(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map((n) => Number(n));
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function startOfWeek(d: Date): Date {
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
  rangeEnd: Date,
): EventInstance[] {
  const events: EventInstance[] = [];

  for (const c of classrooms) {
    if (!c.startDate || !c.endDate || !c.startTime || !c.endTime || !c.days)
      continue;

    const periodStart = parseYmd(c.startDate.split("T")[0]);
    const periodEnd = parseYmd(c.endDate.split("T")[0]);

    const start =
      rangeStart.getTime() > periodStart.getTime() ? rangeStart : periodStart;
    const end = rangeEnd.getTime() < periodEnd.getTime() ? rangeEnd : periodEnd;

    if (start.getTime() > end.getTime()) continue;

    let cur = new Date(start);
    cur.setHours(0, 0, 0, 0);

    const last = new Date(end);
    last.setHours(0, 0, 0, 0);

    while (cur.getTime() <= last.getTime()) {
      const dow = cur.getDay();
      if (c.days.includes(dow)) {
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

  events.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  return events;
}

export default function StudentCalendarPage() {
  const router = useRouter();
  const [view, setView] = useState<ViewMode>("week");
  const [anchor, setAnchor] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await fetch("/api/students/classrooms");
        if (!res.ok) {
          router.push("/students/login");
          return;
        }
        const data = await res.json();
        if (data.classrooms) setClassrooms(data.classrooms);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassrooms();
  }, [router]);

  const range = useMemo(() => {
    if (view === "day") return { start: anchor, end: anchor };
    if (view === "week") {
      const start = startOfWeek(anchor);
      const end = addDays(start, 6);
      return { start, end };
    }
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
    if (view === "day")
      return anchor.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    if (view === "week") {
      const s = range.start.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      const e = range.end.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      return `Week: ${s} – ${e}`;
    }
    return monthLabel(anchor);
  }, [anchor, range.end, range.start, view]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#C52D2F]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#FFF0F0] p-3 text-[#C52D2F]">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
                Student Portal
              </p>
              <h1 className="mt-1 text-2xl font-bold text-[#4D4D4D] sm:text-3xl">
                My Study Calendar
              </h1>
              <p className="mt-2 text-sm text-[#808080]">
                Manage your schedule and join live classes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-full border border-[#E6E6E6] bg-white p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setView("day")}
                className={`rounded-full px-4 py-2 transition ${view === "day" ? "bg-[#C52D2F] text-white" : "text-[#4D4D4D]"}`}
              >
                Day
              </button>
              <button
                type="button"
                onClick={() => setView("week")}
                className={`rounded-full px-4 py-2 transition ${view === "week" ? "bg-[#C52D2F] text-white" : "text-[#4D4D4D]"}`}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setView("month")}
                className={`rounded-full px-4 py-2 transition ${view === "month" ? "bg-[#C52D2F] text-white" : "text-[#4D4D4D]"}`}
              >
                Month
              </button>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-[#E6E6E6] bg-white p-1">
              <button
                type="button"
                onClick={prev}
                className="rounded-full px-3 py-2 text-xs font-semibold hover:text-[#C52D2F]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="px-3 text-xs font-bold text-[#4D4D4D] uppercase tracking-wider">
                {headerTitle}
              </div>
              <button
                type="button"
                onClick={next}
                className="rounded-full px-3 py-2 text-xs font-semibold hover:text-[#C52D2F]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
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
    </div>
  );
}

function DayView({ date, events }: { date: Date; events: EventInstance[] }) {
  const ymd = yyyyMmDd(date);
  const list = events.filter((e) => e.date === ymd);
  return (
    <TimelineDayView
      ymd={ymd}
      date={date}
      list={list}
      baseHref="/students/classroom"
    />
  );
}

function TimelineDayView({
  ymd,
  date,
  list,
  baseHref,
}: {
  ymd: string;
  date: Date;
  list: EventInstance[];
  baseHref: string;
}) {
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
    <section className="rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-sm">
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#808080]">
            {ymd}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#4D4D4D]">
            {date.toLocaleDateString(undefined, { weekday: "long" })}
          </h2>
        </div>
        <div className="text-xs font-bold text-[#C52D2F] uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full border border-red-100">
          {list.length} Classes Today
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {list.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-sm text-[#808080]">
              No classes scheduled for today.
            </p>
          </div>
        ) : (
          slots.map((s) => {
            const items = byStart.get(s.key) || [];
            if (items.length === 0) return null;
            return items.map((item) => (
              <Link
                key={item.classroomId}
                href={`${baseHref}/${item.classroomId}`}
                className="flex items-center gap-6 p-6 rounded-3xl border border-[#E6E6E6] bg-white hover:border-[#C52D2F] transition group"
              >
                <div className="w-24 shrink-0 text-lg font-bold text-[#4D4D4D]">
                  {item.startTime}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#4D4D4D]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#808080]">
                    {item.startTime} – {item.endTime}
                  </p>
                </div>
                <div className="rounded-full bg-[#C52D2F] px-6 py-2 text-xs font-bold text-white transition group-hover:scale-105">
                  Join Session
                </div>
              </Link>
            ));
          })
        )}
      </div>
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
    <div className="grid gap-4 md:grid-cols-7">
      {days.map((d) => {
        const ymd = yyyyMmDd(d);
        const list = byDate.get(ymd) || [];
        const isToday = ymd === yyyyMmDd(new Date());

        return (
          <div
            key={ymd}
            className={`rounded-3xl border border-[#E6E6E6] bg-white p-4 flex flex-col min-h-[300px] transition hover:shadow-lg ${isToday ? "ring-2 ring-[#C52D2F] ring-offset-2" : ""}`}
          >
            <button
              type="button"
              onClick={() => onPickDate(d)}
              className="text-left mb-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#808080]">
                {dayLabel(d)}
              </p>
              <p
                className={`text-2xl font-bold ${isToday ? "text-[#C52D2F]" : "text-[#4D4D4D]"}`}
              >
                {dayNumber(d)}
              </p>
            </button>
            <div className="flex-1 space-y-2">
              {list.map((e) => (
                <Link
                  key={e.classroomId}
                  href={`/students/classroom/${e.classroomId}`}
                  className="block rounded-2xl bg-slate-50 p-2 text-[10px] font-bold text-[#4D4D4D] border border-transparent hover:border-[#C52D2F] transition"
                >
                  <p className="truncate">{e.title}</p>
                  <p className="mt-1 text-[#808080]">{e.startTime}</p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
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
  for (const e of events) byDate.set(e.date, (byDate.get(e.date) ?? 0) + 1);

  return (
    <section className="rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-sm">
      <div className="grid grid-cols-7 gap-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-bold uppercase tracking-widest text-[#808080] mb-2"
          >
            {d}
          </div>
        ))}
        {days.map((d) => {
          const ymd = yyyyMmDd(d);
          const count = byDate.get(ymd) || 0;
          const isOtherMonth = d.getMonth() !== anchor.getMonth();
          return (
            <button
              key={ymd}
              onClick={() => onPickDate(d)}
              className={`h-24 rounded-2xl border border-[#E6E6E6] p-3 text-left transition hover:border-[#C52D2F] ${isOtherMonth ? "opacity-30" : "bg-white"}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-bold text-[#4D4D4D]">
                  {dayNumber(d)}
                </span>
                {count > 0 && (
                  <span className="h-2 w-2 rounded-full bg-[#C52D2F]" />
                )}
              </div>
              {count > 0 && (
                <p className="mt-2 text-[9px] font-bold uppercase text-[#808080]">
                  {count} Classes
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
