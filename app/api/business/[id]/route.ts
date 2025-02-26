import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  request: NextRequest,
  context: any // ใช้ context ที่มี params
) {
  try {
    const pathname = request.nextUrl.pathname;
    const id = pathname.split("/").pop(); // ดึงค่าจาก dynamic route [id]

    // ตรวจสอบว่า id เป็นเลข
    const businessID = parseInt(id || "", 10);
    if (isNaN(businessID)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // ดึง businessinfo พร้อมข้อมูล personinfo แถวแรก
    const businessinfoData = await prisma.businessinfo.findUnique({
      where: { ID: businessID },
    });

    if (!businessinfoData) {
      return NextResponse.json({ error: "Business info not found" }, { status: 404 });
    }

    const personinfoData = await prisma.personinfo.findFirst({
      where: { BusinessID: businessID },
    });
    const urlData = await prisma.urlbusiness.findFirst({
      where: { BusinessID: businessID },
    });

    // รวมข้อมูล
    const result = {
      ...businessinfoData,
      urldata: urlData,
      personinfo: personinfoData || null, // เพิ่ม personinfo แถวแรก

    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
