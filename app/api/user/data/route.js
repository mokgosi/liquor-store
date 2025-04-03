import dbConnect from "@/config/db"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import User from "@/models/User"

export async function GET(request) {
    try {

        const { userId } = getAuth(request)

        await dbConnect()
        const user = await User.findById(userId)

        if(!user) {
            return NextResponse.json({success: false, message: 'User not found.'})
        }

        return NextResponse.json({success: true, user })

    } catch(err) {
        return NextResponse.json({success: false, message: err.message})
    }
}