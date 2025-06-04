import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

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
      include: {
        businessinfo: true,
      }
    });

    // ดึงข้อมูลจาก consultantinfo
    const consultantinfoData = await prisma.consultantinfo.findMany({

      where: whereClause,
      include: {
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

    return NextResponse.json(uniqueData, {
      headers: {
        'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Failed to load members' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const imageFile = formData.get("image");
  const NameThai = formData.get("NameThai");
  const NameEng = formData.get("NameEng");
  const nationality = formData.get("nationality");
  const RoleThai = "ครูช่าง";
  const RoleEng = "Artisan";
  const gender = formData.get("gender");
  const description = formData.get("description");
  const Contact = formData.get("Contact");
  const Year = formData.get("Year");
  const BussinessNameEng = formData.get("BussinessNameEng");
  const BusinessID = formData.get("BusinessID")
  const cleanedBusinessName = BussinessNameEng?.toString()
    .replace(/[^\w\-]/g, "")
    .replace(/\s+/g, "");

  const currentDate = new Date();
  const year = currentDate.getFullYear(); // ปี
  const month = currentDate.getMonth() + 1; // เดือน (เริ่มจาก 0 ดังนั้นต้อง +1)
  const date = currentDate.getDate();
  const formattedDate = `${year}${month.toString().padStart(2, "0")}${date
    .toString()
    .padStart(2, "0")}`;
  let imagePath;
  const uploadDir = path.join(
    process.cwd(),
    `public/images/entreprenuer/Koyori_${Year}/${cleanedBusinessName}/Profile`
  );

  if (!imageFile || !(imageFile instanceof Blob)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const filePath = path.join(uploadDir, `${formattedDate}-${imageFile.name}`);

  const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
  await fs.writeFile(filePath, fileBuffer);
  imagePath = `${formattedDate}-${imageFile.name}`;

  const randomCode: number = Math.floor(1000 + Math.random() * 9000);

  if (
    !NameThai ||
    !NameEng ||
    !nationality ||
    !RoleThai ||
    !gender ||
    !description ||
    !Contact ||
    !Year
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const newMember = await prisma.personinfo.create({
    data: {
      ID: Number(Year + '' + randomCode),
      BusinessID: Number(BusinessID),
      NameThai: NameThai.toString(),
      NameEng: NameEng.toString(),
      nationality: nationality.toString(),
      RoleThai: RoleThai.toString(),
      RoleEng: RoleEng.toString(),
      gender: gender.toString(),
      description: description.toString(),
      Contact: Contact.toString(),
      Year: Number(Year),
      picture: imagePath.toString(),
    },
  });

  return NextResponse.json({ message: "Added member successfully", newMember }, {
    headers: {
      'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}