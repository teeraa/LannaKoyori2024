import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    let province = req.nextUrl.searchParams.get("province");
    const search = req.nextUrl.searchParams.get("search");
    let limit = req.nextUrl.searchParams.get("limit");
    let page = req.nextUrl.searchParams.get("page");
    const type = req.nextUrl.searchParams.get("type");
    const order = req.nextUrl.searchParams.get("orderBy");

    const orderBy = order === "desc" ? "desc" : "asc";

    const offset = (Number(page) - 1) * Number(limit);

    if (!page) {
      page = "1";
    }
    if (!limit) {
      limit = "12";
    }

    if (province == "เชียงใหม่") {
      province = "Chiang Mai";
    } else if (province == "ลำปาง") {
      province = "Lampang";
    } else if (province == "ลำพูน") {
      province = "Lamphun";
    } else if (province == "แม่ฮ่องสอน") {
      province = "Mae Hong Son";
    } else if (province == "แพร่") {
      province = "Phrae";
    } else if (province == "พะเยา") {
      province = "Phayao";
    } else if (province == "เชียงราย") {
      province = "Chiang Rai";
    } else if (province == "น่าน") {
      province = "Nan";
    } else if (province == "ตาก") {
      province = "Tak";
    } else {
      province;
    }

    const whereClause: any = {};
    if (province) {
      whereClause.OR = [{ ProvinceE: province }];
    }
    if (type) {
      whereClause.OR = [{ BusiTypeId: type }];
    }
    if (search) {
      whereClause.OR = [{ BussinessName: { contains: search } }];
    }
    const data = await prisma.businessinfo.findMany({
      where: whereClause,
      orderBy: {
        ID: orderBy,
      },
      take: Number(limit),
      skip: offset,
    });

    const allData = await prisma.businessinfo.count({
      where: whereClause,
      orderBy: {
        ID: orderBy,
      },
    })
    const totalPages = Math.ceil(allData / Number(limit));

    const result = {
      payload:
        data.map((business) => ({
          BusinessID: business.ID,
          BussinessName: business.BussinessName,
          BussinessNameEng: business.BussinessNameEng,
          AddressThai: business.AddressThai,
          Latitude: business.Latitude,
          Longtitude: business.Longtitude,
          Year: business.DataYear,
          picture: business.picture,
          ProvinceT: business.ProvinceT,
        })),
      meta: {
      page: Number(page),
      limit: Number(limit),
      totalPages: totalPages,
      totalData: allData,
    }
    };
    

    return NextResponse.json(result, {
      headers: {
        "Access-Control-Allow-Origin": "*", // In production, set this to your specific domain
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
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
