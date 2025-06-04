import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

        return NextResponse.json(data, {
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
