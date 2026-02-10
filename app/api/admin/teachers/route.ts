import { NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { getSession, hashPassword } from "../../_lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const teachers = await prisma.user.findMany({
      where: { role: "TEACHER" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        birthday: true,
        gender: true,
        address: true,
        secondaryEmail: true,
        phone1: true,
        phone2: true,
        hasWhatsApp: true,
        hasTelegram: true,
        referralSource: true,
        createdAt: true,
      } as any,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ teachers });
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      email,
      password,
      firstName,
      lastName,
      birthday,
      gender,
      address,
      secondaryEmail,
      phone1,
      phone2,
      hasWhatsApp,
      hasTelegram,
      referralSource,
    } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password too short" },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "TEACHER",
        firstName,
        lastName,
        birthday: birthday ? new Date(birthday) : null,
        gender,
        address,
        secondaryEmail,
        phone1,
        phone2,
        hasWhatsApp: !!hasWhatsApp,
        hasTelegram: !!hasTelegram,
        referralSource,
      } as any,
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      } as any,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Failed to create teacher:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
