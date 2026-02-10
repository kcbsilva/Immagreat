import { NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { getSession } from "../../_lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "TEACHER" && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const classrooms = await prisma.classroomSession.findMany({
      where: session.role === "ADMIN" ? {} : { primaryTeacherId: session.sub },
      include: {
        enrollments: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ classrooms });
  } catch (error) {
    console.error("Failed to fetch classrooms:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || (session.role !== "TEACHER" && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      startDate,
      endDate,
      startTime,
      endTime,
      days, // array of booleans from UI [Sun, Mon, ...]
      studentEmails, // array of strings
    } = body;

    // Convert days boolean array to Int array [0, 1, 2, ...]
    const daysIntArray = days
      .map((selected: boolean, index: number) => (selected ? index : null))
      .filter((v: number | null) => v !== null) as number[];

    // Create the session
    const classroom = await prisma.classroomSession.create({
      data: {
        title: title || "New Classroom",
        primaryTeacherId: session.sub,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        startTime,
        endTime,
        days: daysIntArray,
        livekitRoom: `room-${Math.random().toString(36).slice(2, 8)}`, // Fallback unique name
      },
    });

    // Handle enrollments
    if (studentEmails && Array.isArray(studentEmails)) {
      for (const email of studentEmails) {
        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          await prisma.enrollment.upsert({
            where: {
              userId_classroomSessionId: {
                userId: user.id,
                classroomSessionId: classroom.id,
              },
            },
            update: {},
            create: {
              userId: user.id,
              classroomSessionId: classroom.id,
              role: "STUDENT",
            },
          });
        }
      }
    }

    return NextResponse.json({ classroom }, { status: 201 });
  } catch (error) {
    console.error("Failed to create classroom:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
