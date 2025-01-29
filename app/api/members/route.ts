import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// ใช้ Prisma Client แบบ Global เพื่อป้องกัน Connection Leak
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const roleThai = searchParams.get('roleThai');
    const year = searchParams.get('Year');
    const nationality = searchParams.get('nationality');
    const gender = searchParams.get('gender');
    const search = searchParams.get('search');

    try {
       
        const existingParams: Record<string, string | undefined> = {};

        const whereClause: any = {};

        if (roleThai) whereClause.RoleThai = roleThai;
        if (year) whereClause.Year = parseInt(year);
        if (nationality) whereClause.nationality = nationality;
        if (gender) whereClause.gender = gender;
        if (search) {
            whereClause.OR = [
                { NameThai: { contains: search } },
                { NameEng: { startsWith: search, lte: 'insensitive' } },
                { RoleThai: { contains: search } },
            ];
        }
        // console.log('Where Clause:', whereClause);
        const personinfoData = await prisma.personinfo.findMany({

            where: whereClause,
            include:{
                businessinfo: true,
            }
        });

        // ดึงข้อมูลจาก consultantinfo
        const consultantinfoData = await prisma.consultantinfo.findMany({

            where: whereClause,
            include:{
                businessinfo: true,
            }
        });

        // รวมข้อมูลจากทั้งสองตาราง
        const combinedData = [...personinfoData, ...consultantinfoData];

        // กรองข้อมูลที่ซ้ำกันใน NameThai และ NameEng โดยใช้ Set
        const uniqueData = Array.from(
            new Map(combinedData.map(item => [`${item.NameThai}-${item.NameEng}`, item])).values()
        );

        // const members = await prisma.personinfo.findMany({
        //     where: whereClause,
        // });

        return NextResponse.json(uniqueData, { status: 200 });
    } catch (error) {
        console.error('Error fetching members:', error);
        return NextResponse.json({ error: 'Failed to load members' }, { status: 500 });
    }
}
