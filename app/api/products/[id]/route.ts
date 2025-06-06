import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
);

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

  // Add CORS headers to all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  const cleanedBusinessName = BussinessNameEng?.toString()
    .replace(/[^\w\-]/g, "")
    .replace(/\s+/g, "");

  let imagePath;

  if (imageFile && imageFile instanceof File) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();
    const formattedDate = `${year}${month.toString().padStart(2, "0")}${date
      .toString()
      .padStart(2, "0")}`;
    
    const filename = `${formattedDate}-${imageFile.name}`;
    const filePath = `entreprenuer/Koyori_${DataYear}/Products/${filename}`;
    
    try {
      // Optional: Delete old image if updating
      const existingProduct = await prisma.products.findUnique({
        where: { ID: Number(id) },
        select: { image: true }
      });
      
      if (existingProduct?.image) {
        // Extract path from existing URL if it's a full URL
        let oldPath = existingProduct.image;
        if (existingProduct.image.includes('/')) {
          // If it's a URL, extract the path part
          const urlParts = existingProduct.image.split('/');
          const pathIndex = urlParts.findIndex(part => part === 'entreprenuer');
          if (pathIndex !== -1) {
            oldPath = urlParts.slice(pathIndex).join('/');
          }
        } else {
          // If it's just a filename, construct the full path
          oldPath = `entreprenuer/Koyori_${DataYear}/Products/${existingProduct.image}`;
        }
        
        // Remove old image
        await supabase.storage
          .from('koyori-image')
          .remove([oldPath]);
      }

      // Upload new image to Supabase Storage
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

      // Get public URL
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

  // Validate required fields
  if (!productName || !price) {
    return NextResponse.json(
      { error: "Product name and price are required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const updateProductData: any = {
    productName: productName.toString(),
    price: Number(price),
  };

  // Add optional fields if they exist
  if (description) {
    updateProductData.description = description.toString();
  }
  if (color) {
    updateProductData.color = color.toString();
  }
  if (size) {
    updateProductData.size = size.toString();
  }
  if (mainMaterial) {
    updateProductData.mainMaterial = Number(mainMaterial);
  }
  if (subMaterial1) {
    updateProductData.subMaterial1 = Number(subMaterial1);
  }
  if (subMaterial2) {
    updateProductData.subMaterial2 = Number(subMaterial2);
  }

  // Add image path if new image was uploaded
  if (imagePath) {
    updateProductData.image = imagePath;
  }

  try {
    const updateProduct = await prisma.products.update({
      where: {
        ID: Number(id),
      },
      data: updateProductData
    });

    return NextResponse.json({
      message: "อัปเดตข้อมูลเรียบร้อยแล้ว",
      updateProduct,
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500, headers: corsHeaders }
    );
  }
}
