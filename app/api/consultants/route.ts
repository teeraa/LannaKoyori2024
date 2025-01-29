import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const businessID = req.nextUrl.searchParams.get("businessID");
        if (!businessID) {
            return NextResponse.json(
                { error: "Missing 'material' parameter" },
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

        return NextResponse.json(data, { status: 200 });
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
