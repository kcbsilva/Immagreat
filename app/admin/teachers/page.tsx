"use client";

import { useMemo, useState, useEffect } from "react";
import {
  School,
  Search,
  Mail,
  Calendar,
  ArrowRight,
  UserPlus,
  MoreVertical,
  Loader2,
  Lock,
} from "lucide-react";

type Teacher = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  birthday?: string | null;
  gender?: string | null;
  address?: string | null;
  secondaryEmail?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  hasWhatsApp?: boolean;
  hasTelegram?: boolean;
  referralSource?: string | null;
  createdAt: string;
};

export default function AdminTeachersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/teachers");
      const data = await res.json();
      if (data.teachers) {
        setTeachers(data.teachers);
      }
    } catch (err) {
      console.error("Failed to fetch teachers from DB", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (t) =>
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.lastName?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [teachers, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.email.includes("@")) return;

    // Only require password for NEW teachers
    if (!editingTeacher && formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingTeacher
        ? `/api/admin/teachers/${editingTeacher.id}`
        : "/api/admin/teachers";

      const method = editingTeacher ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        resetForm();
        setIsModalOpen(false);
        setEditingTeacher(null);
        fetchTeachers(); // Refresh list
      } else {
        const error = await res.json();
        alert(error.error || "Operation failed");
      }
    } catch (err) {
      alert("An error occurred. Make sure your database is running.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
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
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      email: teacher.email,
      password: "", // Don't prepopulate password
      firstName: teacher.firstName || "",
      lastName: teacher.lastName || "",
      birthday: teacher.birthday
        ? new Date(teacher.birthday).toISOString().split("T")[0]
        : "",
      gender: teacher.gender || "",
      address: teacher.address || "",
      secondaryEmail: teacher.secondaryEmail || "",
      phone1: teacher.phone1 || "",
      phone2: teacher.phone2 || "",
      hasWhatsApp: !!teacher.hasWhatsApp,
      hasTelegram: !!teacher.hasTelegram,
      referralSource: teacher.referralSource || "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section className="flex flex-col gap-4 rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Admin Control
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
            Manage Teachers
          </h1>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#808080]">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E6E6] bg-white px-3 py-1">
              <School className="h-3.5 w-3.5 text-blue-600" />
              {teachers.length} Active Teachers
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
              className="w-full rounded-full border border-[#E6E6E6] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-600 sm:w-64"
            />
          </div>
          <button
            onClick={() => {
              setEditingTeacher(null);
              resetForm();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" /> Add Teacher
          </button>
        </div>
      </section>

      {/* Teachers List */}
      <section className="rounded-3xl border border-[#E6E6E6] bg-white overflow-hidden shadow-lg shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6E6E6] bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#808080]">
                  Teacher Info
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
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-[#808080]">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading teachers...
                    </div>
                  </td>
                </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-sm text-[#808080]"
                  >
                    {searchQuery
                      ? "No teachers found matching your search."
                      : "No teachers registered in the system yet."}
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="group transition hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">
                          {teacher.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#4D4D4D]">
                            {teacher.firstName && teacher.lastName
                              ? `${teacher.firstName} ${teacher.lastName}`
                              : teacher.email}
                          </p>
                          {(teacher.firstName || teacher.lastName) && (
                            <p className="text-[10px] text-[#808080]">
                              {teacher.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#808080]">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(teacher.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="rounded-full border border-[#E6E6E6] p-2 text-[#808080] transition hover:border-blue-600 hover:text-blue-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="group/btn inline-flex items-center gap-1 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                          Manage
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

      {/* Add Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl scale-in-center overflow-hidden rounded-3xl border border-[#E6E6E6] bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)]">
            <div
              className={`p-6 text-white transition-colors ${editingTeacher ? "bg-amber-500" : "bg-blue-600"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                  {editingTeacher ? "Update Profile" : "New Teacher Access"}
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition"
                >
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
              </div>
              <h2 className="text-2xl font-bold">
                {editingTeacher
                  ? `Editing ${editingTeacher.firstName || "Teacher"}`
                  : "Personal Information"}
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
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
                    placeholder="Jane"
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-blue-600"
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
                    placeholder="Smith"
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-blue-600"
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
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-blue-600"
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
                    className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-blue-600"
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
                  className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-blue-600"
                />
              </div>

              {/* Login & Security Section */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#4D4D4D] mb-4 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-600" /> Account Security
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div
                    className={
                      editingTeacher ? "opacity-60 pointer-events-none" : ""
                    }
                  >
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                      Email Address (Login)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808080]" />
                      <input
                        type="email"
                        required
                        disabled={!!editingTeacher}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="teacher@immagreat.com"
                        className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 pl-11 text-sm outline-none transition focus:border-blue-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                      {editingTeacher
                        ? "New Security Password (Optional)"
                        : "Security Password"}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808080]" />
                      <input
                        type="password"
                        required={!editingTeacher}
                        minLength={6}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder={
                          editingTeacher
                            ? "•••••••• (Leave blank to keep current)"
                            : "••••••••"
                        }
                        className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 pl-11 text-sm outline-none transition focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#4D4D4D] mb-4 flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-blue-600 flex items-center justify-center text-[10px] text-white">
                    C
                  </div>{" "}
                  Contact Details
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                      Secondary Email
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
                      placeholder="backup@email.com"
                      className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                      Primary Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone1}
                      onChange={(e) =>
                        setFormData({ ...formData, phone1: e.target.value })
                      }
                      placeholder="+1 234 567 890"
                      className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mt-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                      Secondary Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone2}
                      onChange={(e) =>
                        setFormData({ ...formData, phone2: e.target.value })
                      }
                      placeholder="+1 098 765 432"
                      className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-blue-600"
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-8">
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
                        className="h-4 w-4 rounded border-[#E6E6E6] text-blue-600 focus:ring-blue-600"
                      />
                      <span className="text-xs font-medium text-[#4D4D4D] group-hover:text-blue-600 transition">
                        WhatsApp
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
                        className="h-4 w-4 rounded border-[#E6E6E6] text-blue-600 focus:ring-blue-600"
                      />
                      <span className="text-xs font-medium text-[#4D4D4D] group-hover:text-blue-600 transition">
                        Telegram
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Recruitment/Source */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#808080] mb-2">
                  Referral / Source
                </label>
                <input
                  type="text"
                  value={formData.referralSource}
                  onChange={(e) =>
                    setFormData({ ...formData, referralSource: e.target.value })
                  }
                  placeholder="How did they join?"
                  className="w-full rounded-2xl border border-[#E6E6E6] bg-white p-4 text-sm outline-none transition focus:border-blue-600"
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
                  className={`flex-[2] rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 ${editingTeacher ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingTeacher ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  {editingTeacher ? "Update Teacher" : "Register Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
