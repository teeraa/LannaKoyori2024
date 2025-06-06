import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
);

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
    });

    // ดึงข้อมูลจาก consultantinfo
    const consultantinfoData = await prisma.consultantinfo.findMany({
      where: whereClause,
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

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const imageFile = formData.get("image"); // Profile image
  const bannerFile = formData.get("banner"); // Banner image
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
  const BusinessID = formData.get("BusinessID");

  // Add CORS headers to all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  const cleanedBusinessName = BussinessNameEng?.toString()
    .replace(/[^\w\-]/g, "")
    .replace(/\s+/g, "");

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  const formattedDate = `${year}${month.toString().padStart(2, "0")}${date
    .toString()
    .padStart(2, "0")}`;

  let imagePath;
  let bannerPath;

  // Upload profile image
  if (!imageFile || !(imageFile instanceof File)) {
    return NextResponse.json(
      { error: "Profile image file is required" }, 
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    // Upload profile image to Supabase
    const profileFilename = `${formattedDate}-${imageFile.name}`;
    const profileFilePath = `entreprenuer/Koyori_${Year}/Profile/${profileFilename}`;

    const { data: profileData, error: profileError } = await supabase.storage
      .from('koyori-image')
      .upload(profileFilePath, imageFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (profileError) {
      console.error('Supabase profile upload error:', profileError);
      return NextResponse.json(
        { error: "Failed to upload profile image" },
        { status: 500, headers: corsHeaders }
      );
    }

    // Get public URL for profile image
    const { data: profileUrlData } = supabase.storage
      .from('koyori-image')
      .getPublicUrl(profileFilePath);

    imagePath = profileUrlData.publicUrl;

    // Upload banner image if provided
    if (bannerFile && bannerFile instanceof File) {
      const bannerFilename = `${formattedDate}-banner-${bannerFile.name}`;
      const bannerFilePath = `entreprenuer/Koyori_${Year}/Banner/${bannerFilename}`;

      const { data: bannerData, error: bannerError } = await supabase.storage
        .from('koyori-image')
        .upload(bannerFilePath, bannerFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (bannerError) {
        console.error('Supabase banner upload error:', bannerError);
        return NextResponse.json(
          { error: "Failed to upload banner image" },
          { status: 500, headers: corsHeaders }
        );
      }

      // Get public URL for banner image
      const { data: bannerUrlData } = supabase.storage
        .from('koyori-image')
        .getPublicUrl(bannerFilePath);

      bannerPath = bannerUrlData.publicUrl;
    }

  } catch (error) {
    console.error('Failed to upload images:', error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500, headers: corsHeaders }
    );
  }

  // Validate required fields
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
      { status: 400, headers: corsHeaders }
    );
  }

  const randomCode: number = Math.floor(1000 + Math.random() * 9000);

  try {
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
        picture: imagePath,
        banner: bannerPath,
      },
    });

    return NextResponse.json(
      { message: "Added member successfully", newMember }, 
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Database creation error:', error);
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500, headers: corsHeaders }
    );
  }
}