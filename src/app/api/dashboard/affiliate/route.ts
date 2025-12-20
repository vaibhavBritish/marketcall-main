import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        user: true,
      },
    });

    return NextResponse.json({ leads }, { status: 200 });
  } catch (error) {
    console.error("Error while fetching leads:", error);
    return NextResponse.json(
      { message: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
