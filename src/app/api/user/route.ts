import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export async function GET() {
    try {

        const session = await auth();

        if (!session || !session.user?.id) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (session.user.role == "CANDIDATE") {

            const user = await prisma.user.findUnique({
                where: {
                    id: session.user.id,
                },
                select: {
                    name: true,
                    email: true,
                    image: true
                },
            });

            if (!user) {
                return Response.json(
                    { success: false, message: "User not found" },
                    { status: 404 }
                );
            }

            return Response.json(
                { success: true, data: user },
                { status: 200 }
            );

        }
        else {
            const candidate = await prisma.user.findUnique({
                where: {
                    id: session.user.id,
                },
                select: {
                    company: true
                }
            });

            if (!candidate) {
                return Response.json(
                    { success: false, message: "Company not found" },
                    { status: 404 }
                );
            }

            const company = candidate.company;

            const companyDetails = {
                companyId: company?.id,
                companyName: company?.name,
                companyDescription: company?.description,
                companyWebsite: company?.website,
                companyLogo: company?.logo
            }

            return Response.json(
                { success: true, data: companyDetails },
                { status: 200 }
            );

        }


    }
    catch (error) {
        return Response.json(
            { success: false, message: `Error: ${error}` },
            { status: 500 }
        );
    }
}


export async function PUT(req: Request) {
    try {

        const session = await auth();

        if (!session || !session.user?.id) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (session.user.role == "CANDIDATE") {

            const { name, email, image } = await req.json();

            const user = await prisma.user.update({
                where: {
                    id: session.user.id,
                },
                data: {
                    name, email, image
                }
            });

            if (!user) {
                return Response.json(
                    { success: false, message: "User not found" },
                    { status: 404 }
                );
            }

            return Response.json(
                { success: true },
                { status: 200 }
            );

        }
        else {
            const candidate = await prisma.user.findUnique({
                where: {
                    id: session.user.id,
                },
                select: {
                    companyId: true
                }
            });

            if (!candidate) {
                return Response.json(
                    { success: false, message: "Company not found" },
                    { status: 404 }
                );
            }

            const companyId = candidate.companyId;

            const { companyName, companyDescription, companyWebsite, companyLogo } = await req.json();

            const company = await prisma.company.update({
                where: {
                    id: companyId as string
                },
                data: {
                    name: companyName,
                    description: companyDescription,
                    website: companyWebsite,
                    logo: companyLogo
                }
            });

            if (!company) {
                return Response.json(
                    { success: false, message: "Company not found" },
                    { status: 404 }
                );
            }

            return Response.json(
                { success: true },
                { status: 200 }
            );

        }


    }
    catch (error) {
        return Response.json(
            { success: false, message: `Error: ${error}` },
            { status: 500 }
        );
    }
}