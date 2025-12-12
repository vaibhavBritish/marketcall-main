import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ""
});

export async function GET(request: NextRequest, context: { params: Promise<{id:string}>}){
    try {
        const {id} = await context.params;
        const lead = await prisma.leads.findUnique({
            where:{
                id: id
            }
        })

        return NextResponse.json({message:"Lead fetched successfully", lead}, {status: 200});
    } catch (error) {
        console.log("Error getting while fetching lead by id:", error);
    }
}

export async function DELETE(request:NextRequest, context : {params : Promise<{id:string}>}){
    try {
        const {id} = await context.params;
        const deleteLeadById = await prisma.leads.delete({
            where:{
                id: id
            }
        })

        return NextResponse.json({message:"Lead deleted successfully",deleteLeadById}, {status: 200});
    } catch (error) {
        console.log("Error getting while deleting lead by id:", error);
    }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json({ message: "Invalid lead" }, { status: 400 });
        }

        const form = await request.formData();

        // Extract text fields
        const countryRegion = form.get("countryRegion") as string | null;
        const stateProvince = form.get("stateProvince") as string | null;
        const city = form.get("city") as string | null;
        const postalCode = form.get("postalCode") as string | null;
        const Category = form.get("Category") as string | null;
        const subCategory = form.get("subCategory") as string | null;
        const fullName = form.get("fullName") as string | null;
        const offerType = form.get("offerType") as string | null;
        const payouts = Number(form.get("payouts"));     // FLOAT
        const isMerchantAllowedToRefuseLeads = String(form.get("isMerchantAllowedToRefuseLeads")) === "true";
        const LeadsLimit = Number(form.get("LeadsLimit")); // INT
        const materialModeration = form.get("materialModeration") as string | null;
        const tools = form.get("tools") as string | null;

        // File field
        const imageFile = form.get("imageUrl") as File | null;

        let uploadedImageUrl: string | null = null;

        // Upload only if new image is sent
        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadRes = await imagekit.upload({
                file: buffer,
                fileName: imageFile.name,
            });

            uploadedImageUrl = uploadRes.url;
        }

        // Build update object based on your schema
        const updateData: any = {
            countryRegion,
            stateProvince,
            city,
            postalCode,
            Category,
            subCategory,
            fullName,
            offerType,
            payouts,
            isMerchantAllowedToRefuseLeads,
            LeadsLimit,
            materialModeration,
            tools,
        };

        if (uploadedImageUrl) {
            updateData.imageUrl = uploadedImageUrl;
        }

        const updatedLead = await prisma.leads.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(
            { message: "Lead updated successfully", updatedLead },
            { status: 200 }
        );

    } catch (error) {
        console.log("Error while updating lead by id:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: String(error) },
            { status: 500 }
        );
    }
}
