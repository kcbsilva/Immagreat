import { NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { hashPassword, setSessionCookie } from "../../_lib/auth";

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string; password?: string; role?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  const role = (body.role ?? "STUDENT").toUpperCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password too short" }, { status: 400 });
  }
  const allowedRoles = ["STUDENT", "TEACHER", "MODERATOR"] as const;
  const isAllowedRole = (r: string): r is (typeof allowedRoles)[number] =>
    (allowedRoles as readonly string[]).includes(r);

  if (!isAllowedRole(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, role },
    select: { id: true, email: true, role: true },
  });

  await setSessionCookie({ sub: user.id, email: user.email, role: user.role });
  return NextResponse.json({ user });
}
