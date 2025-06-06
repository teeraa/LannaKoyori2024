import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function GET(
  request: NextRequest,
  context: any // ใช้ context ที่มี params
) {
  try {
    const pathname = request.nextUrl.pathname;
    const id = pathname.split("/").pop(); // ดึงค่าจาก dynamic route [id]

    // ตรวจสอบว่า id เป็นเลข
    const personID = parseInt(id || "", 10);
    if (isNaN(personID)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const personinfoData = await prisma.personinfo.findFirst({
      where: { ID: personID },
      include: {
        businessinfo: true,
      },
    });
    if (personinfoData != null) {
      const contact = await prisma.contacts.findFirst({
        where: { businessID: personinfoData?.businessinfo?.ID }
      })

      const memberResult = {
        memberID: personinfoData?.ID,
        memberNameThai: personinfoData?.NameThai,
        memberNameEng: personinfoData?.NameEng,
        memberRoleThai: personinfoData?.RoleThai,
        memberRoleEng: personinfoData?.RoleEng,
        memberPosition: personinfoData?.Position,
        memberNationality: personinfoData?.nationality,
        memberGender: personinfoData?.gender,
        memberContact: personinfoData?.Contact,
        memberDescription: personinfoData?.description,
        memberpicture: personinfoData?.picture,
        memberBanner: personinfoData?.banner,

        contactUs: {
          facebook_name: contact?.facebook_name || "ไม่ระบุm",
          facebook_url: contact?.facebook_url || "ไม่ระบุ",
          instagram_name: contact?.instagram_name || "ไม่ระบุ",
          instagram_url: contact?.instagram_url || "ไม่ระบุ",
          lineId_name: contact?.lineId_name || "ไม่ระบุ",
          line_url: contact?.line_url || "ไม่ระบุ",
          email: contact?.email || "ไม่ระบุ",
          phone: contact?.phone_number || "ไม่ระบุ",
          website_name: contact?.website_name || "ไม่ระบุ",
          website_url: contact?.website_url || "ไม่ระบุ",
        },

        BusinessID: personinfoData?.businessinfo?.ID,
        BussinessName: personinfoData?.businessinfo?.BussinessName,
        BussinessNameEng: personinfoData?.businessinfo?.BussinessNameEng,
        AddressThai: personinfoData?.businessinfo?.AddressThai,
        Latitude: personinfoData?.businessinfo?.Latitude,
        Longtitude: personinfoData?.businessinfo?.Longtitude,
        Year: personinfoData?.businessinfo?.DataYear,
        picture: personinfoData?.businessinfo?.picture,

      }


      return NextResponse.json(memberResult, {
        headers: {
          'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    if (personinfoData == null) {
      const consultantinfoData = await prisma.consultantinfo.findFirst({
        where: { ID: personID },
        include: {
          businessinfo: true,
        }
      });

      const contactConsult = await prisma.contacts.findFirst({
        where: { businessID: consultantinfoData?.businessinfo?.ID }
      })

      const consultResult = {
        memberID: consultantinfoData?.ID,
        memberNameThai: consultantinfoData?.NameThai,
        memberNameEng: consultantinfoData?.NameEng,
        memberRoleThai: consultantinfoData?.RoleThai,
        memberRoleEng: consultantinfoData?.RoleEng,
        memberNationality: consultantinfoData?.nationality,
        memberGender: consultantinfoData?.gender,
        // memberDescription: consultantinfoData?.description,
        memberpicture: consultantinfoData?.picture,

        contactUs: {
          facebook_name: contactConsult?.facebook_name || "ไม่ระบุ",
          facebook_url: contactConsult?.facebook_url || "ไม่ระบุ",
          instagram_name: contactConsult?.instagram_name || "ไม่ระบุ",
          instagram_url: contactConsult?.instagram_url || "ไม่ระบุ",
          lineId_name: contactConsult?.lineId_name || "ไม่ระบุ",
          line_url: contactConsult?.line_url || "ไม่ระบุ",
          email: contactConsult?.email || "ไม่ระบุ",
          phone: contactConsult?.phone_number || "ไม่ระบุ",
          website_name: contactConsult?.website_name || "ไม่ระบุ",
          website_url: contactConsult?.website_url || "ไม่ระบุ",
        },

        BusinessID: consultantinfoData?.businessinfo?.ID,
        BussinessName: consultantinfoData?.businessinfo?.BussinessName,
        BussinessNameEng: consultantinfoData?.businessinfo?.BussinessNameEng,
        AddressThai: consultantinfoData?.businessinfo?.AddressThai,
        Latitude: consultantinfoData?.businessinfo?.Latitude,
        Longtitude: consultantinfoData?.businessinfo?.Longtitude,
        Year: consultantinfoData?.businessinfo?.DataYear,
        picture: consultantinfoData?.businessinfo?.picture,

      }

      // const combinedData = [memberResult, consultResult];

      // // กรองข้อมูลที่ซ้ำกันใน NameThai และ NameEng โดยใช้ Set
      // const uniqueData = Array.from(
      //   new Map(combinedData.map(item => [`${item.memberNameThai}-${item.memberNameEng}`, item])).values()
      // );

      return NextResponse.json(consultResult, {
        headers: {
          'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
