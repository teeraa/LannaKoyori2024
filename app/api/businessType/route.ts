import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { log } from "console";

export async function GET () {
    try {
        const data = await prisma.businesstype.findMany();

        return NextResponse.json(data, {
            headers: {
                'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        })
    }catch (error) {
        console.log(error);
        return NextResponse.json({message: "Failed to fetch type of business"}, {status: 500})
    }finally{
        await prisma.$disconnect();
    }
}