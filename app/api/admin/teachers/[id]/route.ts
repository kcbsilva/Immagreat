import { NextResponse } from "next/server";
import { prisma } from "../../../_lib/prisma";
import { getSession, hashPassword } from "../../../_lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Next.js 15+ Params are a Promise
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const body = await req.json();
    const {
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
      password, // Support password change
    } = body;

    const data: any = {
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
    };

    if (password && password.length >= 6) {
      data.passwordHash = await hashPassword(password);
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Failed to update teacher:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
