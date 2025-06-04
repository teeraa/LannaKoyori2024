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

    const formattedData = data.map((item) => ({
      ID: item.ID,
      productName: item.productName,
      price: item.price,
      mainMaterial: item.mainMaterial,
      subMaterial1: item.subMaterial1,
      subMaterial2: item.subMaterial2,
      subMaterial3: item.subMaterial3,
      bussinessID: item.bussinessID,
      image: item.image,
      sketch: item.sketch,
      description: item.description,
      color: item.color,
      size: item.size,
      materialMain: item.materialMain
        ? {
            ID: item.materialMain.ID,
            Material: item.materialMain.Material,
          }
        : {
            ID: 0,
            Material: "ไม่มีวัตถุดิบรอง",
          },
      materialSub1: item.materialSub1
        ? {
            ID: item.materialSub1.ID,
            Material: item.materialSub1.Material,
          }
        : {
            ID: 0,
            Material: "ไม่มีวัตถุดิบรอง",
          },
      materialSub2: item.materialSub2
        ? {
            ID: item.materialSub2.ID,
            Material: item.materialSub2.Material,
          }
        : {
            ID: 0,
            Material: "ไม่มีวัตถุดิบรอง",
          },
      materialSub3: item.materialSub3
        ? {
            ID: item.materialSub3.ID,
            Material: item.materialSub3.Material,
          }
        : {
            ID: 0,
            Material: "ไม่มีวัตถุดิบรอง",
          },
            BusinessID: item.businessinfo?.ID,
            Year: item.businessinfo?.DataYear,
            BusiTypeId: item.businessinfo?.BusiTypeId,
            BussinessName: item.businessinfo?.BussinessName,
            BussinessNameEng: item.businessinfo?.BussinessNameEng,
            AddressThai: item.businessinfo?.AddressThai,
            Latitude: item.businessinfo?.Latitude,
            Longtitude: item.businessinfo?.Longtitude,
            picture: item.businessinfo?.picture,
    }));

    return NextResponse.json(formattedData, {
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
