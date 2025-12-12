import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface JWTPayload {
    id: string;
    email: string;
    username?: string;
    isAdmin: boolean;
    userType?: string;
    iat: number;
    exp: number;
}
export async function GET(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

        return NextResponse.json(
            {
                user: {
                    id: decoded.id,
                    email: decoded.email,
                    username: decoded.username,
                    isAdmin: decoded.isAdmin,
                    userType: decoded.userType,
                }
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("JWT verification failed:", error);
        return NextResponse.json({ user: null }, { status: 200 });
    }
}