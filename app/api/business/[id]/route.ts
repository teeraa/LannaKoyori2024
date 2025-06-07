import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
);

export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const pathname = request.nextUrl.pathname;
    const id = pathname.split("/").pop(); // ดึงค่าจาก dynamic route [id]

    // ตรวจสอบว่า id เป็นเลข
    const businessID = parseInt(id || "", 10);
    if (isNaN(businessID)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const business = await prisma.businessinfo.findFirst({
      where: {
        ID: businessID,
      },
      include: {
        businesstype: true,
        urlbusiness: true,
        personinfo: true,
        topic_detail: true,
        contacts: true,
      },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const firstPerson = business.personinfo?.[0];

    const result = {
      BusinessID: business.ID,
      BussinessName: business.BussinessName,
      BussinessNameEng: business.BussinessNameEng,
      AddressThai: business.AddressThai,
      TombolT: business.TumbolT,
      AmphurT: business.AmphurT,
      ProvinceT: business.ProvinceT,
      ZipCodeT: business.ZipCodeT,
      AddressT: business.AddressT,
      Latitude: business.Latitude,
      Longtitude: business.Longtitude,
      Year: business.DataYear,
      picture: business.picture,
      banner: business.banner,

      memberID: firstPerson?.ID,
      memberNameThai: firstPerson?.NameThai,
      memberNameEng: firstPerson?.NameEng,
      memberRoleThai: firstPerson?.RoleThai,
      memberRoleEng: firstPerson?.RoleEng,
      memberPosition: firstPerson?.Position,
      memberNationality: firstPerson?.nationality,
      memberGender: firstPerson?.gender,
      memberContact: firstPerson?.Contact,
      memberpicture: firstPerson?.picture,
      memberbanner: firstPerson?.banner,

      contactUs: {
        facebook_name: business.contacts?.[0]?.facebook_name || "ไม่ระบุ",
        facebook_url: business.contacts?.[0]?.facebook_url || "ไม่ระบุ",
        instagram_name: business.contacts?.[0]?.instagram_name || "ไม่ระบุ",
        instagram_url: business.contacts?.[0]?.instagram_url || "ไม่ระบุ",
        lineId_name: business.contacts?.[0]?.lineId_name || "ไม่ระบุ",
        line_url: business.contacts?.[0]?.line_url || "ไม่ระบุ",
        email: business.contacts?.[0]?.email || "ไม่ระบุ",
        phone: business.contacts?.[0]?.phone_number || "ไม่ระบุ",
        website_name: business.contacts?.[0]?.website_name || "ไม่ระบุ",
        website_url: business.contacts?.[0]?.website_url || "ไม่ระบุ",
      },
      BusiTypeName_TH: business.businesstype?.BusiTypeName_TH || "ไม่ระบุ",
      BusiTypeName_EN: business.businesstype?.BusiTypeName_EN || "ไม่ระบุ",

      description_TH: (business.topic_detail?.[0].First_DescriptionTH || "") + (business.topic_detail?.[0].Second_DescriptionTH || ""),
      description_EN: (business.topic_detail?.[0].First_DescriptionEN || "") + (business.topic_detail?.[0].Second_DescriptionEN || ""),
      description_JP: (business.topic_detail?.[0].First_DescriptionJP || "") + (business.topic_detail?.[0].Second_DescriptionJP || ""),

      vedio: business.urlbusiness?.map((url) => ({
        id: url?.ID || "ไม่ระบุ",
        url: url?.url || "ไม่ระบุ",
        title: url?.title || "ไม่ระบุ",
      })) || [],
    };

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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

export async function PUT(req: NextRequest) {
  const formData = await req.formData();
  const imageFile = formData.get("image");
  const bannerFile = formData.get("banner");
  const BussinessName = formData.get("BussinessName");
  const BussinessNameEng = formData.get("BussinessNameEng");
  const DataYear = formData.get("DataYear");
  const AddressT = formData.get("AddressT");
  const TumbolT = formData.get("TumbolT");
  const AmphurT = formData.get("AmphurT");
  const ProvinceT = formData.get("ProvinceT");
  const ZipCodeT = formData.get("ZipCodeT");
  const Latitude = formData.get("Latitude");
  const Longtitude = formData.get("Longtitude");
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  const formattedDate = `${year}${month.toString().padStart(2, "0")}${date
    .toString()
    .padStart(2, "0")}`;

  // Add CORS headers to all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  let imagePath;
  let bannerPath;

  if (imageFile && imageFile instanceof File) { // Changed from Blob to File


    const filename = `${formattedDate}-${imageFile.name}`;
    const filePath = `entreprenuer/Koyori_${DataYear}/LogoBusiness/${filename}`;

    try {
      // Optional: Delete old image if updating
      const existingBusiness = await prisma.businessinfo.findUnique({
        where: { ID: Number(id) },
        select: { picture: true }
      });

      if (existingBusiness?.picture) {
        // Extract path from existing URL
        const oldPath = existingBusiness.picture.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('koyori-image')
            .remove([`entreprenuer/Koyori_${DataYear}/LogoBusiness/${oldPath}`]);
        }
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('koyori-image')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500, headers: corsHeaders }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from('koyori-image')
        .getPublicUrl(filePath);

      imagePath = publicUrlData.publicUrl;

    } catch (error) {
      console.error('Failed to upload image:', error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500, headers: corsHeaders }
      );
    }
  }

  if (bannerFile && bannerFile instanceof File) {
    const bannerFilename = `${formattedDate}-banner-${bannerFile.name}`;
    const bannerFilePath = `entreprenuer/Koyori_${DataYear}/Banner/${bannerFilename}`;

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

  if (
    !BussinessName ||
    !AddressT ||
    !TumbolT ||
    !AmphurT ||
    !ProvinceT ||
    !ZipCodeT ||
    !Latitude ||
    !Longtitude
  ) {
    console.log(BussinessName, AddressT, TumbolT, AmphurT, ProvinceT, ZipCodeT, Latitude, Longtitude);
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const updateData: any = {
    BussinessName: BussinessName.toString(),
    AddressT: AddressT.toString(),
    TumbolT: TumbolT.toString(),
    AmphurT: AmphurT.toString(),
    ProvinceT: ProvinceT.toString(),
    ZipCodeT: ZipCodeT.toString(),
    Latitude: Latitude?.toString(),
    Longtitude: Longtitude?.toString(),
  };

  // Add optional fields
  if (BussinessNameEng) {
    updateData.BussinessNameEng = BussinessNameEng.toString();
  }

  if (imagePath) {
    updateData.picture = imagePath;
  }

  if (bannerPath) {
    updateData.banner = bannerPath;
  }

  try {
    const updateBusiness = await prisma.businessinfo.update({
      where: {
        ID: Number(id),
      },
      data: updateData,
    });

    return NextResponse.json(updateBusiness, { headers: corsHeaders });
  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json(
      { error: "Failed to update business" },
      { status: 500, headers: corsHeaders }
    );
  }
}
