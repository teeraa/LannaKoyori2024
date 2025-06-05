import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { writeFile } from "fs/promises";

export async function GET(req: NextRequest) {
  try {
    // รับ query parameter 'material'
    const material = req.nextUrl.searchParams.get("material");
    const search = req.nextUrl.searchParams.get("search");

    const whereClause: any = {};

    if (material) {
      whereClause.OR = [
        { materialMain: { Material: material } },
        { materialSub1: { Material: material } },
        { materialSub2: { Material: material } },
        { materialSub3: { Material: material } },
      ];
    }

    if (search) {
      whereClause.OR = [
        { materialMain: { Material: material } },
        { materialSub1: { Material: material } },
        { materialSub2: { Material: material } },
        { materialSub3: { Material: material } },
        { productName: { contains: search } },
      ];
    }

    // if (!material) {
    //   return NextResponse.json(
    //     { error: "Missing 'material' parameter" },
    //     { status: 400 }
    //   );
    // }

    // Query ข้อมูลจาก Prisma โดย Join ทั้ง 3 ตาราง
    const data = await prisma.products.findMany({
      where: whereClause,
      include: {
        materialMain: true, // Join ตาราง materials สำหรับ mainMaterial
        materialSub1: true, // Join ตาราง materials สำหรับ subMaterial1
        materialSub2: true, // Join ตาราง materials สำหรับ subMaterial2
        materialSub3: true, // Join ตาราง materials สำหรับ subMaterial3
        businessinfo: true, // Join ตาราง businessinfo
      },
    });

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
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
  const BussinessNameEng = formData.get("BussinessNameEng");
  const cleanedBusinessName = BussinessNameEng?.toString()
    .replace(/[^\w\-]/g, "")
    .replace(/\s+/g, "");

  let imagePath;
  const minId = Number(DataYear) * 10000; // 20250000
  const maxId = (Number(DataYear) + 1) * 10000; // 20260000

  const lastProduct = await prisma.products.findFirst({
    where: {
      ID: {
        gte: minId,
        lt: maxId,
      },
    },
    orderBy: {
      ID: "desc",
    },
  });

  let newSuffix = 1;
  if (lastProduct) {
    newSuffix = (lastProduct.ID % 10000) + 1;
  }

  const newProductId = Number(DataYear) * 10000 + newSuffix;
  const uploadDir = path.join(process.cwd(), `https://lannakoyori.org/images/entrpenuer/Koyori_${DataYear}/Products/`);

  const images = formData.getAll("images") as File[];
  const uploadedImageNames: string[] = [];

  for (const image of images) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${image.name}`;
    const filepath = path.join(process.cwd(), `https://lannakoyori.org/images/entrpenuer/Koyori_${DataYear}/Products/`, filename);

    await writeFile(filepath, buffer);
    uploadedImageNames.push(filename);
  }

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

  if (!productName || !price) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const updateProductData: any = {
    ID: newProductId,
    productName: productName.toString(),
    description: description?.toString(),
    color: color?.toString(),
    size: size?.toString(),
    price: Number(price),
    mainMaterial: Number(mainMaterial),
    subMaterial1: Number(subMaterial1),
    subMaterial2: Number(subMaterial2),
  };

  if (imagePath) {
    updateProductData.image = imagePath;
  }

  const updateProduct = await prisma.products.create({
    data: updateProductData,
  });

  if (uploadedImageNames.length > 0) {
    await prisma.product_image.createMany({
      data: uploadedImageNames.map((filename) => ({
        product_id: Number(newProductId),
        image: filename,
      })),
    });
  }
  // for (const mat of materialList) {
  //   console.log("Processing material:", mat); // Debug what's being processed

  //   if (!mat.id) {
  //     console.log("Skipping material with no ID:", mat);
  //     continue;
  //   }

  //   if (!mat.name) {
  //     console.log("Skipping material with no name:", mat);
  //     continue;
  //   }

  //   try {
  //     const result = await prisma.materials.create({
  //       data: {
  //         Material: mat.name.toString(),
  //       },
  //     });
  //     console.log(`Successfully updated material ID ${mat.id}:`, result);
  //   } catch (error: any) {
  //     console.error(`Error updating material ID ${mat.id}:`, error);
  //     // Return the error in the response for debugging
  //     return NextResponse.json(
  //       {
  //         message: "Error updating materials",
  //         error: error.message,
  //         materialId: mat.id,
  //       },
  //       { status: 500 }
  //     );
  //   }
  // }

  return NextResponse.json({
    message: "บันทึกข้อมูลเรียบร้อยแล้ว",
    updateProduct,
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
