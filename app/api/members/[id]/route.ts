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
    const personID = parseInt(id || "", 10);
    if (isNaN(personID)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const personinfoData = await prisma.personinfo.findMany({
      where: { ID: personID },
      include: {
        businessinfo: true
      },
      // select: {
      //   ID: true,
      //   NameThai: true,
      //   NameEng: true,
      //   gender: true,
      //   RoleThai: true,
      //   nationality: true,
      //   Year: true,
      //   Contact: true,
      //   picture: true,
      // },
    });
    const consultantinfoData = await prisma.consultantinfo.findMany({
      // select: {
      //     ID: true,
      //     NameThai: true,
      //     NameEng: true,
      //     gender: true,
      //     RoleThai: true,
      //     nationality: true,
      //     Year: true,
      //     picture: true,
      // },
      where: { ID: personID },
      include: {
        businessinfo: true,
      }
    });
    const combinedData = [...personinfoData, ...consultantinfoData];

    // กรองข้อมูลที่ซ้ำกันใน NameThai และ NameEng โดยใช้ Set
    const uniqueData = Array.from(
      new Map(combinedData.map(item => [`${item.NameThai}-${item.NameEng}`, item])).values()
    );

    // const members = await prisma.personinfo.findMany({
    //     where: whereClause,
    // });

    return NextResponse.json(uniqueData, {
      headers: {
        'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
