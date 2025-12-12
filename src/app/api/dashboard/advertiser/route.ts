import { prisma } from "@/lib/prisma";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const countryRegion = formData.get("countryRegion")?.toString();
    const stateProvince = formData.get("stateProvince")?.toString();
    const city = formData.get("city")?.toString();
    const postalCode = formData.get("postalCode")?.toString();
    const Category = formData.get("Category")?.toString();
    const subCategory = formData.get("subCategory")?.toString();
    const fullName = formData.get("fullName")?.toString();
    const offerType = formData.get("offerType")?.toString();
    const payouts = formData.get("payouts");
    const materialModeration = formData.get("materialModeration")?.toString();
    const tools = formData.get("tools")?.toString();
    const LeadsLimit = formData.get("LeadsLimit")?.toString();
    const isMerchantAllowedToRefuseLeads = formData.get("isMerchantAllowedToRefuseLeads");
    const imageFile = formData.get("imageUrl") as File | null;

    const merchantRefuse = String(isMerchantAllowedToRefuseLeads) === "true";


    if (
        !countryRegion || !stateProvince || !city || !postalCode ||
        !Category || !subCategory || !fullName || !offerType ||
        !payouts || !materialModeration || !tools ||
        imageFile === null || imageFile.size === 0
    ) {
        return NextResponse.json(
            { message: "All fields including image are required" },
            { status: 400 }
        );
    }



    let uploadedImageUrl = null;

    try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResponse = await imagekit.upload({
            file: buffer.toString("base64"),
            fileName: `${fullName.replace(/\s+/g, "_")}.jpg`,
            folder: "/leads_images",
            useUniqueFileName: true,
        });

        uploadedImageUrl = uploadResponse.url;

    } catch (error) {
        console.error("Image upload failed:", error);
        return NextResponse.json(
            { message: "Image upload failed" },
            { status: 500 }
        );
    }



    try {
        const lead = await prisma.leads.create({
            data: {
                countryRegion,
                stateProvince,
                city,
                postalCode,
                Category,
                subCategory,
                fullName,
                offerType,
                payouts: Number(payouts),
                materialModeration,
                tools,
                LeadsLimit: LeadsLimit ? Number(LeadsLimit) : 0,
                isMerchantAllowedToRefuseLeads: merchantRefuse,
                imageUrl: uploadedImageUrl,
            }
        });

        return NextResponse.json(
            { message: "Lead Created Successfully", lead },
            { status: 201 }
        );

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function GET(request: NextRequest) {
    try {
        const leads = await prisma.leads.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ leads }, { status: 200 });

    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}