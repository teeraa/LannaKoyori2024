import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// export async function GET(
//   request: NextRequest,
//   context: any // ใช้ context ที่มี params
// ) {
//   try {
//     const pathname = request.nextUrl.pathname;
//     const id = pathname.split("/").pop(); // ดึงค่าจาก dynamic route [id]

//     // ตรวจสอบว่า id เป็นเลข
//     const businessID = parseInt(id || "", 10);
//     if (isNaN(businessID)) {
//       return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
//     }

//     // ดึง businessinfo พร้อมข้อมูล personinfo แถวแรก
//     const businessinfoData = await prisma.businessinfo.findUnique({
//       where: { ID: businessID },
//     });

//     if (!businessinfoData) {
//       return NextResponse.json({ error: "Business info not found" }, { status: 404 });
//     }

//     const personinfoData = await prisma.personinfo.findFirst({
//       where: { BusinessID: businessID },
//     });
//     const urlData = await prisma.urlbusiness.findFirst({
//       where: { BusinessID: businessID },
//     });
//     const businessType = await prisma.businesstype.findFirst({
//       where: {BusiTypeId: businessID},
//     })

//     // รวมข้อมูล
//     const result = {
//       ...businessinfoData,
//       urldata: urlData,
//       personinfo: personinfoData || null,
//       businessType: businessType || "ไม่ระบุ",

//     };

//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: (error as Error).message }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

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

export async function PUT(req: NextRequest) {
  const formData = await req.formData();
  const imageFile = formData.get("image");
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
  const cleanedBusinessName = BussinessNameEng?.toString().replace(/[^\w\-]/g, "").replace(/\s+/g, "")

  let imagePath;
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'entreprenuer', `Koyori_${DataYear}`, 'LogoBusiness');
  if (imageFile && imageFile instanceof Blob) {
    const currentDate = new Date();
    const year = currentDate.getFullYear(); // ปี
    const month = currentDate.getMonth() + 1; // เดือน (เริ่มจาก 0 ดังนั้นต้อง +1)
    const date = currentDate.getDate();
    const formattedDate = `${year}${month.toString().padStart(2, "0")}${date
      .toString()
      .padStart(2, "0")}`;
    // await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, `${formattedDate}-${imageFile.name}`);
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);
    imagePath = `/images/entreprenuer/Koyori_${DataYear}/LogoBusiness/${formattedDate}-${imageFile.name}`; // เก็บ path สำหรับอัปเดต
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
      { status: 400 }
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

  if (imagePath) {
    updateData.picture = imagePath;
  }

  const updateBusiness = await prisma.businessinfo.update({
    where: {
      ID: Number(id),
    },
    data: updateData,
  });

  return NextResponse.json(
    updateBusiness,
    {
      headers: {
        'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  )

}