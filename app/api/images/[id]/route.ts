import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
);

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    try {
        const images = await prisma.product_image.findMany({
            where: {
                product_id: Number(id),
            }
        });

        return NextResponse.json(images, {
            headers: {
                'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    } catch (error) {
        console.log("Error fetching house images:", error);
        return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
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

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const formData = await req.formData();
  const imageFile = formData.get("image") as File | null;
  const DataYear = formData.get("DataYear"); // Get DataYear from form data
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  let imagePath: string | undefined;

  if (imageFile && imageFile instanceof File) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();
    const formattedDate = `${year}${month.toString().padStart(2, '0')}${date.toString().padStart(2, '0')}`;
    
    const filename = `${formattedDate}-${imageFile.name}`;
    const filePath = `entreprenure/Koyori_${DataYear}/Products/${filename}`;
    
    try {
      // Delete old image if updating
      const existingImage = await prisma.product_image.findUnique({
        where: { image_id: Number(id) },
        select: { image: true }
      });
      
      if (existingImage?.image) {
        // Extract filename from existing image path
        const oldFilename = existingImage.image;
        const oldPath = `entreprenure/Koyori_${DataYear}/Products/${oldFilename}`;
        
        await supabase.storage
          .from('koyori-image')
          .remove([oldPath]);
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

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('koyori-image')
        .getPublicUrl(filePath);

      // Store just the filename in database (matching your original logic)
      imagePath = filename;
      
    } catch (error) {
      console.error('Failed to upload image:', error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500, headers: corsHeaders }
      );
    }
  }

  if (!imagePath) {
    return NextResponse.json(
      { error: "No image file provided" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const updateData: any = {
      image: imagePath,
    };

    const updatedImage = await prisma.product_image.update({
      where: {
        image_id: Number(id),
      },
      data: updateData
    });

    return NextResponse.json({
      message: "updated successfully",
      updatedImage
    }, {
      headers: corsHeaders
    });
    
  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json(
      { error: "Failed to update product image" },
      { status: 500, headers: corsHeaders }
    );
  }
}