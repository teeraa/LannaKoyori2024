import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const data = await prisma.materials.findMany();

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log("Error data fetching:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching data" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}