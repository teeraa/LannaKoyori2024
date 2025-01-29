import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        let province = req.nextUrl.searchParams.get("province");

        if(province == "เชียงใหม่"){
            province = "Chiang Mai";
        }else if(province == "ลำปาง"){
            province = "Lampang";
        }else if(province == "ลำพูน"){
            province = "Lamphun";
        }else if(province == "แม่ฮ่องสอน"){
            province = "Mae Hong Son";
        }else if(province == "แพร่"){
            province = "Phrae";
        }else if(province == "พะเยา"){
            province = "Phayao";
        }else if(province == "เชียงราย"){
            province = "Chiang Rai";
        }else if(province == "น่าน"){
            province = "Nan";
        }else if(province == "ตาก"){
            province = "Tak";
        }else{
            province
        }

        const whereClause : any = {};
        if(province){
            whereClause.OR = [
                {ProvinceE: province}
            ]
        }
        const data = await prisma.businessinfo.findMany({
            where: whereClause
        });

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