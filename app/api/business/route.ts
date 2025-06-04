import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        let province = req.nextUrl.searchParams.get("province");
        const search = req.nextUrl.searchParams.get("search");

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
            province
        }

        const whereClause: any = {};
        if (province) {
            whereClause.OR = [
                { ProvinceE: province }
            ]
        }
        if (search) {
            whereClause.OR = [
                { BussinessName: { contains: search } }
            ]
        }
        const data = await prisma.businessinfo.findMany({
            where: whereClause
        });

        const result = data.map((business) => ({
            BusinessID: business.ID,
            BussinessName: business.BussinessName,
            BussinessNameEng: business.BussinessNameEng,
            AddressThai: business.AddressThai,
            Latitude: business.Latitude,
            Longtitude: business.Longtitude,
            Year: business.DataYear,
            picture: business.picture,
            ProvinceT: business.ProvinceT
        }))

        return NextResponse.json(result, {
            headers: {
                'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
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