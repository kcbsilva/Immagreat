"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Users,
  Search,
  Mail,
  Calendar,
  ArrowRight,
  UserPlus,
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

export default function AdminStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    birthday: "",
    gender: "",
    address: "",
    secondaryEmail: "",
    phone1: "",
    phone2: "",
    hasWhatsApp: false,
    hasTelegram: false,
    referralSource: "",
  });

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/students");
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
    fetchStudents();
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

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.email.includes("@")) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          email: "",
          firstName: "",
          lastName: "",
          birthday: "",
          gender: "",
          address: "",
          secondaryEmail: "",
          phone1: "",
          phone2: "",
          hasWhatsApp: false,
          hasTelegram: false,
          referralSource: "",
        });
        setIsModalOpen(false);
        fetchStudents(); // Refresh list
      } else {
        const error = await res.json();
        alert(error.error || "Failed to add student");
      }
    } catch (err) {
      alert("An error occurred. Make sure your database is running.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section className="flex flex-col gap-4 rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C52D2F]">
            Admin Control
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
            System Students
          </h1>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#808080]">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E6E6] bg-white px-3 py-1">
              <Users className="h-3.5 w-3.5 text-[#C52D2F]" />
              {students.length} Total Registered Students
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808080]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#E6E6E6] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#C52D2F] sm:w-64"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C52D2F] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(197,45,47,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a92325]"
          >
            <UserPlus className="h-4 w-4" /> Add Student
          </button>
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
                      Loading system students...
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
                      : "No students registered in the system yet."}
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

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl scale-in-center overflow-hidden rounded-3xl border border-[#E6E6E6] bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)]">
            <div className="bg-[#C52D2F] p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                  New Student Registration
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition"
                >
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
              </div>
              <h2 className="text-2xl font-bold">Personal Information</h2>
            </div>

            <form
              onSubmit={handleAddStudent}
              className="p-8 space-y-6 max-h-[70vh] overflow-y-auto"
            >
              {/* Basic Info Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="John"
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-[#C52D2F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Doe"
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-[#C52D2F]"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                    Birthday
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.birthday}
                    onChange={(e) =>
                      setFormData({ ...formData, birthday: e.target.value })
                    }
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-[#C52D2F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                    Gender
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-[#C52D2F]"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                  Address
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Full street address..."
                  rows={2}
                  className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-[#C52D2F]"
                />
              </div>

              {/* Emails Section */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#4D4D4D] mb-4 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#C52D2F]" /> Contact Emails
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                      Primary Email (Login)
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="primary@email.com"
                      className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-[#C52D2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                      Secondary Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.secondaryEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          secondaryEmail: e.target.value,
                        })
                      }
                      placeholder="secondary@email.com"
                      className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-[#C52D2F]"
                    />
                  </div>
                </div>
              </div>

              {/* Phones Section */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#4D4D4D] mb-4 flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-[#C52D2F] flex items-center justify-center text-[10px] text-white">
                    P
                  </div>{" "}
                  Phone Numbers
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                      Primary Telephone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone1}
                      onChange={(e) =>
                        setFormData({ ...formData, phone1: e.target.value })
                      }
                      placeholder="+1 234 567 890"
                      className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-[#C52D2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                      Secondary Telephone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone2}
                      onChange={(e) =>
                        setFormData({ ...formData, phone2: e.target.value })
                      }
                      placeholder="+1 098 765 432"
                      className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-[#C52D2F]"
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.hasWhatsApp}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hasWhatsApp: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-[#E6E6E6] text-[#C52D2F] focus:ring-[#C52D2F]"
                    />
                    <span className="text-xs font-medium text-[#4D4D4D] group-hover:text-[#C52D2F] transition">
                      Available on WhatsApp
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.hasTelegram}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hasTelegram: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-[#E6E6E6] text-[#C52D2F] focus:ring-[#C52D2F]"
                    />
                    <span className="text-xs font-medium text-[#4D4D4D] group-hover:text-[#C52D2F] transition">
                      Available on Telegram
                    </span>
                  </label>
                </div>
              </div>

              {/* Marketing Section */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                  How did you find us? (Optional)
                </label>
                <input
                  type="text"
                  value={formData.referralSource}
                  onChange={(e) =>
                    setFormData({ ...formData, referralSource: e.target.value })
                  }
                  placeholder="Instagram, Referral, Google, etc."
                  className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-[#C52D2F]"
                />
              </div>

              {/* Submit Section */}
              <div className="pt-6 flex gap-4 sticky bottom-0 bg-white border-t border-gray-100 mt-8 -mx-8 px-8 py-6">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-2xl border border-[#E6E6E6] py-4 text-sm font-bold text-[#4D4D4D] transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] rounded-2xl bg-[#C52D2F] py-4 text-sm font-bold text-white shadow-[0_12px_24px_-8px_rgba(197,45,47,0.4)] transition hover:-translate-y-0.5 hover:bg-[#a92325] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  Register Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
