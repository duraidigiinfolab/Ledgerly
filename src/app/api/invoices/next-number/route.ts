import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { businessName: true },
    });

    const bName = user?.businessName || "INVO";
    const prefix = bName.replace(/[^a-zA-Z0-9]/g, "").substring(0, 4).toUpperCase().padEnd(4, "X");
    const date = new Date();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(10 + Math.random() * 90); // 2 digits
    const nextNumber = `${prefix}${mm}${dd}${random}`;

    return NextResponse.json({
      nextNumber,
      businessName: user?.businessName || "",
    });
  } catch (error) {
    console.error("Error generating invoice number:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice number" },
      { status: 500 }
    );
  }
}
