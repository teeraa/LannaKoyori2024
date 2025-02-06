import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    // ดึง id จาก URL path
    const pathname = request.nextUrl.pathname;
    const id = pathname.split("/").pop(); // ดึงค่าจาก dynamic route [id]

    // ตรวจสอบว่า id เป็นเลข
    const productID = parseInt(id || "", 10);
    if (isNaN(productID)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Query ข้อมูลจาก Prisma
    const productinfoData = await prisma.products.findMany({
      where: { ID: productID },
      include: {
        businessinfo: {
          include: {
            consultantinfo: true, // Include consultants for the business
          },
        }, // Join ตาราง businessinfo
      },
    });

    return NextResponse.json(productinfoData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
