import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import dbConnect from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";


//configuring cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try { 
        const { userId } = getAuth(request)

        const isSeller = await authSeller(userId)

        if(!isSeller) {
            return NextResponse.json({success: false, message: 'You are not a seller.'})
        }

        const data = await request.formData();

        const name = data.get("name");
        const description = data.get("description");
        const price = data.get("price");
        const offerPrice = data.get("offerPrice");
        const category = data.get("category");
        const files = data.getAll("images");
        if (!files || files.length === 0) {
            return NextResponse.json({success: false, message: 'Please select at least one image.'})
        }

        const result = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { resource_type: "auto" },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    ).end(buffer);
                })
            })
        )

        const image = result.map(result => result.secure_url);

        await dbConnect()

        const newProduct = await Product.create({
            userId,
            name,
            description,
            price: Number(price),
            offerPrice: Number(offerPrice),
            category,
            image,
            date: Date.now()
        })

        return NextResponse.json({success: true, message: 'Upload successful.'})

    } catch (e) {
        return NextResponse.json({success: true, message: e.message})
    }
}