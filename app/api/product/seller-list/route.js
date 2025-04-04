import dbConnect from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";

export async function GET(request) {
    try {
        const { userId } = getAuth(request) 
        const isSeller = authSeller(userId)

        if(!isSeller) {
            return NextResponse.json({success: false, message: 'You are not a seller.'})
        }

        await dbConnect()

        const products = await Product.find({})

        return NextResponse.json({success: true, products})
    }
    catch(err) {
        return NextResponse.json({success: false, message: err.message})
    }
}

