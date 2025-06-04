import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

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

const uploadDir = path.join(process.cwd(), "public/uploads");

export async function PUT(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const formData = await req.formData();
    const imageFile = formData.get("image");
    let imagePath;

    if (imageFile && imageFile instanceof Blob) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const date = currentDate.getDate();
        const formattedDate = `${year}${month.toString().padStart(2, '0')}${date.toString().padStart(2, '0')}`;
        const filePath = path.join(uploadDir, `${formattedDate}-${imageFile.name}`);
        const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
        await fs.writeFile(filePath, fileBuffer);
        imagePath = `${formattedDate}-${imageFile.name}`;
    }

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
        headers: {
            'Access-Control-Allow-Origin': '*', // In production, set this to your specific domain
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    })
}