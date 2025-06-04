import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // รับ query parameter 'material'
    const material = req.nextUrl.searchParams.get("material");
    const businessID = req.nextUrl.searchParams.get("businessID");

    const whereClause: any = {};

    if (material) {
      whereClause.OR = [
        { materialMain: { Material: material } },
        { materialSub1: { Material: material } },
        { materialSub2: { Material: material } },
        { materialSub3: { Material: material } },
      ];
    }
    if (businessID) {

      const businessIDAsNumber = parseInt(businessID, 10); // Convert to number
      if (!isNaN(businessIDAsNumber)) {
        whereClause.OR = [
          { bussinessID: businessIDAsNumber },
        ];
      }

    }

    if (!businessID) {
      return NextResponse.json(
        { error: "Missing 'material' parameter" },
        { status: 400 }
      );
    }

    // Query ข้อมูลจาก Prisma โดย Join ทั้ง 3 ตาราง
    const data = await prisma.products.findMany({
      where: whereClause,
      include: {
        materialMain: true, // Join ตาราง materials สำหรับ mainMaterial
        materialSub1: true, // Join ตาราง materials สำหรับ subMaterial1
        materialSub2: true, // Join ตาราง materials สำหรับ subMaterial2
        materialSub3: true, // Join ตาราง materials สำหรับ subMaterial3
        businessinfo: true, // Join ตาราง businessinfo
      },
    });

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
