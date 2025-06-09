import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { writeFile } from "fs/promises";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
);

export async function GET(req: NextRequest) {
  try {
    const material = req.nextUrl.searchParams.get("material");
    const businessType = req.nextUrl.searchParams.get("businessType"); // Now expects BusiTypeName_TH
    const search = req.nextUrl.searchParams.get("search");
    let limit = req.nextUrl.searchParams.get("limit");
    let page = req.nextUrl.searchParams.get("page");
    const order = req.nextUrl.searchParams.get("orderBy");

    const orderBy = order === "desc" ? "desc" : "asc";

    if (!page) page = "1";
    if (!limit) limit = "12";

    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {
      AND: [],
    };

    if (material) {
      whereClause.AND.push({
        OR: [
          { materialMain: { Material: material } },
          { materialSub1: { Material: material } },
          { materialSub2: { Material: material } },
          { materialSub3: { Material: material } },
        ],
      });
    }

    if (search) {
      whereClause.AND.push({
        productName: { contains: search },
      });
    }

    if (businessType) {
      // Find the BusiTypeId based on BusiTypeName_TH
      const businessTypeRecord = await prisma.businesstype.findFirst({
        where: {
          BusiTypeName_TH: businessType,
        },
        select: {
          BusiTypeId: true,
        },
      });

      if (businessTypeRecord) {
        whereClause.AND.push({
          businessinfo: {
            BusiTypeId: businessTypeRecord.BusiTypeId,
          },
        });
      } else {
        // If no matching business type is found, return empty results
        whereClause.AND.push({
          businessinfo: {
            BusiTypeId: -1, // Invalid ID to return no results
          },
        });
      }
    }

    const data = await prisma.products.findMany({
      where: whereClause,
      include: {
        materialMain: true,
        materialSub1: true,
        materialSub2: true,
        materialSub3: true,
        businessinfo: {
          include: {
            businesstype: true,
          },
        },
      },
      orderBy: {
        ID: orderBy,
      },
      take: Number(limit),
      skip: offset,
    });

    const allData = await prisma.products.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(allData / Number(limit));

    const result = {
      payload: data.map((product) => ({
        ID: product.ID,
        productName: product.productName,
        price: product.price,
        image: product.image,
        materialMain: product.materialMain,
        BusinessID: product.businessinfo?.ID,
        BusiTypeId: product.businessinfo?.BusiTypeId,
        BusinessType: product.businessinfo?.businesstype?.BusiTypeName_TH,
        BussinessName: product.businessinfo?.BussinessName,
        BussinessNameEng: product.businessinfo?.BussinessNameEng,
      })),
      meta: {
        page: Number(page),
        limit: Number(limit),
        total_pages: totalPages,
        totalData: allData,
      },
    };

    return NextResponse.json(result, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
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

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const imageFile = formData.get("image"); // Main product image
  const sketchFile = formData.get("sketch"); // Sketch product image
  const productName = formData.get("productName");
  const description = formData.get("description");
  const design = formData.get("design");
  const color = formData.get("color");
  const size = formData.get("size");
  const price = formData.get("price");
  const mainMaterial = formData.get("mainMaterial");
  const subMaterial1 = formData.get("subMaterial1");
  const subMaterial2 = formData.get("subMaterial2");
  const DataYear = formData.get("DataYear");
  const BussinessNameEng = formData.get("BussinessNameEng");
  const BussinessID = formData.get("BussinessID");

  // Add CORS headers to all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  const cleanedBusinessName = BussinessNameEng?.toString()
    .replace(/[^\w\-]/g, "")
    .replace(/\s+/g, "");

  // Generate new product ID
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

  let imagePath;
  let sketchPath;
  const uploadedImageUrls: string[] = [];

  // Current date for filename
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  const formattedDate = `${year}${month.toString().padStart(2, "0")}${date
    .toString()
    .padStart(2, "0")}`;

  try {
    // Upload main product image
    if (imageFile && imageFile instanceof File) {
      const mainFilename = `${formattedDate}-${imageFile.name}`;
      const mainFilePath = `entreprenuer/Koyori_${DataYear}/Products/${mainFilename}`;

      const { data: mainData, error: mainError } = await supabase.storage
        .from("koyori-image")
        .upload(mainFilePath, imageFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (mainError) {
        console.error("Supabase main image upload error:", mainError);
        return NextResponse.json(
          { error: "Failed to upload main image" },
          { status: 500, headers: corsHeaders }
        );
      }

      // Get public URL for main image
      const { data: mainUrlData } = supabase.storage
        .from("koyori-image")
        .getPublicUrl(mainFilePath);

      imagePath = mainUrlData.publicUrl;
    }

    if (sketchFile && sketchFile instanceof File) {
      const mainFilename = `${formattedDate}-${sketchFile.name}`;
      const mainFilePath = `entreprenuer/Koyori_${DataYear}/Sketch/${mainFilename}`;

      const { data: mainData, error: mainError } = await supabase.storage
        .from("koyori-image")
        .upload(mainFilePath, sketchFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (mainError) {
        console.error("Supabase main image upload error:", mainError);
        return NextResponse.json(
          { error: "Failed to upload main image" },
          { status: 500, headers: corsHeaders }
        );
      }

      // Get public URL for main image
      const { data: mainUrlData } = supabase.storage
        .from("koyori-image")
        .getPublicUrl(mainFilePath);

      sketchPath = mainUrlData.publicUrl;
    }

    // Upload additional images
    const images = formData.getAll("images") as File[];

    if (images.length > 0) {
      for (const image of images) {
        if (image instanceof File) {
          const timestamp = Date.now();
          const additionalFilename = `${timestamp}-${image.name}`;
          const additionalFilePath = `entreprenuer/Koyori_${DataYear}/Products/${additionalFilename}`;

          const { data: additionalData, error: additionalError } =
            await supabase.storage
              .from("koyori-image")
              .upload(additionalFilePath, image, {
                cacheControl: "3600",
                upsert: true,
              });

          if (additionalError) {
            console.error(
              "Supabase additional image upload error:",
              additionalError
            );
            // Continue with other images even if one fails
            continue;
          }

          // Get public URL for additional image
          const { data: additionalUrlData } = supabase.storage
            .from("koyori-image")
            .getPublicUrl(additionalFilePath);

          uploadedImageUrls.push(additionalUrlData.publicUrl);
        }
      }
    }
  } catch (error) {
    console.error("Failed to upload images:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500, headers: corsHeaders }
    );
  }

  // Validate required fields
  if (!productName || !price) {
    return NextResponse.json(
      { error: "Product name and price are required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const productData: any = {
    ID: newProductId,
    productName: productName.toString(),
    price: Number(price),
    bussinessID: Number(BussinessID),
  };

  // Add optional fields if they exist
  if (description) {
    productData.description = description.toString();
  }
  if (design) {
    productData.design = design.toString();
  }
  if (color) {
    productData.color = color.toString();
  }
  if (size) {
    productData.size = size.toString();
  }
  if (mainMaterial) {
    productData.mainMaterial = Number(mainMaterial);
  }
  if (subMaterial1) {
    productData.subMaterial1 = Number(subMaterial1);
  }
  if (subMaterial2) {
    productData.subMaterial2 = Number(subMaterial2);
  }

  // Add main image if uploaded
  if (imagePath) {
    productData.image = imagePath;
  }

  if (sketchPath) {
    productData.sketch = sketchPath;
  }

  try {
    // Create the product
    const newProduct = await prisma.products.create({
      data: productData,
    });

    // Create additional product images if any were uploaded
    if (uploadedImageUrls.length > 0) {
      await prisma.product_image.createMany({
        data: uploadedImageUrls.map((imageUrl) => ({
          product_id: Number(newProductId),
          image: imageUrl, // Store full URL or just filename based on your needs
        })),
      });
    }

    return NextResponse.json(
      {
        message: "บันทึกข้อมูลเรียบร้อยแล้ว",
        product: newProduct,
        additionalImages: uploadedImageUrls.length,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Database creation error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500, headers: corsHeaders }
    );
  }
}
