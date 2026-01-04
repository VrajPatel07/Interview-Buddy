import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export async function GET() {
    try {

        const session = await auth();

        if (!session || !session.user?.email) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (session.user.role == "CANDIDATE") {

            const candidate = await prisma.candidate.findUnique({
                where: {
                    email: session.user.email,
                },
                select: {
                    name: true,
                    email: true,
                    avatar: true
                },
            });

            if (!candidate) {
                return Response.json(
                    { success: false, message: "User not found" },
                    { status: 404 }
                );
            }

            return Response.json(
                { success: true, data: candidate },
                { status: 200 }
            );

        }
        else {
            const company = await prisma.company.findUnique({
                where: {
                    email: session.user.email
                }
            });

            if (!company) {
                return Response.json(
                    { success: false, message: "Company not found" },
                    { status: 404 }
                );
            }

            const companyDetails = {
                name: company.name,
                email: company.email,
                description: company.description,
                website: company.website,
                logo : company.logo
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

        if (!session || !session.user?.email) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (session.user.role == "CANDIDATE") {

            const { name, email, avatar } = await req.json();

            const candidate = await prisma.candidate.update({
                where: {
                    email: session.user.email,
                },
                data: {
                    name, email, avatar
                }
            });

            if (!candidate) {
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

            const { name, email, description, logo, website } = await req.json();

            const company = await prisma.company.update({
                where: {
                    email: session.user.email
                },
                data : {
                    name, email, description, logo, website
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