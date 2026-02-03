import { NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { setSessionCookie, verifyPassword } from "../../_lib/auth";

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await setSessionCookie({ sub: user.id, email: user.email, role: user.role });
  return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } });
}
