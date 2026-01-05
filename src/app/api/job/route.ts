import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export async function POST (req : Request) {
    try {

        const session = await auth();

        if (!session || !session.user?.id) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const {title, description} = await req.json();

        await prisma.job.create({
            data : {
                title,
                description,
                isPublic : false,
                status : "DRAFT",
                companyId : session.user.id
            }
        });

        return Response.json(
            { success: true },
            { status: 200 }
        );
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
                data: {
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