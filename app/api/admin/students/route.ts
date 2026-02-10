import { NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { getSession, hashPassword } from "../../_lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // In a real app, we might only want students associated with this teacher
    // For now, let's return all students to populate the management view
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        email: true,
        createdAt: true,
        enrollments: {
          select: {
            classroomSession: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Failed to fetch students:", error);
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

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    // Create student with a default password
    const defaultPassword = "ChangeMe123!";
    const passwordHash = await hashPassword(defaultPassword);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "STUDENT",
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
    console.error("Failed to create student:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
