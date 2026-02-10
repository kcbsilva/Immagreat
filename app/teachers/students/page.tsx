"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Users,
  Search,
  Mail,
  Calendar,
  ArrowRight,
  MoreVertical,
  BookOpen,
  Loader2,
} from "lucide-react";
import Link from "next/link";

type Student = {
  email: string;
  name?: string | null;
  enrolledClasses: { id: string; title: string }[];
  lastActivity?: number;
};

export default function TeacherStudentsPage() {
  const [teacherEmail, setTeacherEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/teachers/students");
      const data = await res.json();
      if (data.students) {
        setDbStudents(data.students);
      }
    } catch (err) {
      console.error("Failed to fetch students from DB", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setTeacherEmail(data.user.email);
        fetchStudents();
      }
    };
    checkAuth();
  }, []);

  const students = useMemo(() => {
    return dbStudents.map((s) => ({
      email: s.email,
      name: s.firstName && s.lastName ? `${s.firstName} ${s.lastName}` : null,
      enrolledClasses:
        s.enrollments?.map((e: any) => ({
          id: e.classroomSession.id,
          title: e.classroomSession.title,
        })) || [],
      lastActivity: new Date(s.createdAt).getTime(),
    }));
  }, [dbStudents]);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s as any).name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [students, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section className="flex flex-col gap-4 rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
            Student Directory
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
            My Students
          </h1>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#808080]">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E6E6] bg-white px-3 py-1">
              <Users className="h-3.5 w-3.5 text-[#C52D2F]" />
              {students.length} Total Students
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808080]" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#E6E6E6] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#C52D2F] sm:w-64"
            />
          </div>
        </div>
      </section>

      {/* Students List */}
      <section className="rounded-3xl border border-[#E6E6E6] bg-white overflow-hidden shadow-lg shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6E6E6] bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#808080]">
                  Student Info
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#808080]">
                  Enrolled Classes
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#808080]">
                  Joined Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E6E6]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-[#808080]">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading students...
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-[#808080]"
                  >
                    {searchQuery
                      ? "No students found matching your search."
                      : "No students enrolled in your classes yet."}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.email}
                    className="group transition hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF5F5] text-[#C52D2F] font-bold">
                          {student.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#4D4D4D]">
                            {(student as any).name || student.email}
                          </p>
                          {(student as any).name && (
                            <p className="text-[10px] text-[#808080]">
                              {student.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {student.enrolledClasses.length > 0 ? (
                          student.enrolledClasses.map(
                            (cls: { id: string; title: string }) => (
                              <Link
                                key={cls.id}
                                href={`/teachers/classroom/${cls.id}`}
                                className="inline-flex items-center gap-1 rounded-full bg-white border border-[#E6E6E6] px-2.5 py-1 text-[11px] font-medium text-[#4D4D4D] transition hover:border-[#C52D2F] hover:text-[#C52D2F]"
                              >
                                <BookOpen className="h-3 w-3" />
                                {cls.title}
                              </Link>
                            ),
                          )
                        ) : (
                          <span className="text-[10px] text-[#808080] italic">
                            No active enrollments
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#808080]">
                        <Calendar className="h-3.5 w-3.5" />
                        {student.lastActivity
                          ? new Date(student.lastActivity).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="rounded-full border border-[#E6E6E6] p-2 text-[#808080] transition hover:border-[#C52D2F] hover:text-[#C52D2F]">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <button className="group/btn inline-flex items-center gap-1 rounded-full bg-[#C52D2F] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#a92325]">
                          Profile
                          <ArrowRight className="h-3 w-3 transition group-hover/btn:translate-x-0.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
