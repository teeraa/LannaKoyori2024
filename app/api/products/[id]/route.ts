import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    // ดึง id จาก URL path
    const pathname = request.nextUrl.pathname;
    const id = pathname.split("/").pop(); // ดึงค่าจาก dynamic route [id]

    // ตรวจสอบว่า id เป็นเลข
    const productID = parseInt(id || "", 10);
    if (isNaN(productID)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Query ข้อมูลจาก Prisma
    const productinfoData = await prisma.products.findMany({
      where: { ID: productID },
      include: {
        businessinfo: {
          include: {
            consultantinfo: true, // Include consultants for the business
          },
        }, // Join ตาราง businessinfo
      },
    });


    return NextResponse.json(productinfoData, {
      headers: {
        'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: NextRequest) {
  const formData = await req.formData();
  const imageFile = formData.get("image");
  const productName = formData.get("productName");
  const description = formData.get("description");
  const color = formData.get("color");
  const size = formData.get("size");
  const price = formData.get("price");
  const mainMaterial = formData.get("mainMaterial");
  const subMaterial1 = formData.get("subMaterial1");
  const subMaterial2 = formData.get("subMaterial2");
  const DataYear = formData.get("DataYear");
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const BussinessNameEng = formData.get("BussinessNameEng");
  const cleanedBusinessName = BussinessNameEng?.toString()
    .replace(/[^\w\-]/g, "")
    .replace(/\s+/g, "");

  let imagePath;
  const uploadDir = path.join(
    process.cwd(),
    `https://lannakoyori.org/images/entrpenuer/Koyori_${DataYear}/Products/`
  );

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
    imagePath = `${formattedDate}-${imageFile.name}`; // เก็บ path สำหรับอัปเดต
  }

  if (
    !productName ||
    !price
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const updateProductData: any = {
    productName: productName.toString(),
    description: description?.toString(),
    color: color?.toString(),
    size: size?.toString(),
    price: Number(price),
    mainMaterial: Number(mainMaterial),
    subMaterial1: Number(subMaterial1),
    subMaterial2: Number(subMaterial2),
  }

  if (imagePath) {
    updateProductData.image = imagePath;
  }

  const updateProduct = await prisma.products.update({
    where: {
      ID: Number(id),
    },
    data: updateProductData
  })

  return NextResponse.json({
    message: "อัปเดตข้อมูลเรียบร้อยแล้ว",
    updateProduct,
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}
