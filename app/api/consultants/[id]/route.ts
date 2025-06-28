import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const pathname = req.nextUrl.pathname
        const businessID = pathname.split("/").pop()
        if (!businessID) {
            return NextResponse.json(
                { error: "Missing business id parameter" },
                { status: 400 }
            );
        }
        const whereClause: any = {};
        if (businessID) {
            const businessIDAsNumber = parseInt(businessID, 10); // Convert to number
            if (!isNaN(businessIDAsNumber)) {
                whereClause.OR = [{ BusinessID: businessIDAsNumber }];
            } else {
                return NextResponse.json(
                    { error: "Invalid BusinessID parameter. Must be a valid number." },
                    { status: 400 }
                );
            }
        }

        const data = await prisma.consultantinfo.findMany({
            where: whereClause,
            include: {
                businessinfo: true,
            }
        });

        const allData = await prisma.consultantinfo.count({
            where: whereClause,
        });

        const result = {
            payload : 
            data.map ((consult)=>({
                ID: consult.ID,
                BusinessID: consult.BusinessID,
                NameThai: consult.NameThai,        
                NameEng: consult.NameEng,
                RoleThai: consult.RoleThai,
                RoleEng: consult.RoleEng,
                nationality: consult.nationality,
                gender: consult.gender,
                Year: consult.Year,
                picture: consult.picture
            })),
            meta : {
                totalData: allData
            }
        }

        return NextResponse.json(result, {
            headers: {
                'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    } catch (error) {
        console.error("Error data fetching:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching data" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
