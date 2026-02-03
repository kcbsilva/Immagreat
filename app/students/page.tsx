import { redirect } from "next/navigation";

export default function StudentsIndexPage() {
  // Keep a single entrypoint.
  redirect("/students/login");
}
