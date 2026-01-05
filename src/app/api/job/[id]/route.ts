import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest } from "next/server";


export async function PATCH( req: Request, { params }: { params: Promise<{ id: string }> } ) {
    try {

        const session = await auth();

        if (!session?.user?.id) {
            return Response.json({ success: false }, { status: 401 });
        }

        const body = await req.json();
        const {id} = await params;

        const job = await prisma.job.update({
            where: {
                id : id,
                companyId : session.user.id
            },
            data: {
                title : body.title,
                description : body.description,
                status : body.status
            }
        });

        return Response.json({ success: true, data: job });

    } 
    catch (error) {
        return Response.json(
            { success: false, message: `${error}` },
            { status: 500 }
        );
    }
}



export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const session = await auth();

        if (!session?.user?.id) {
            return Response.json({ success: false }, { status: 401 });
        }

        const {id} = await params;

        await prisma.job.delete({
            where: {
                id,
                companyId : session?.user?.id
            },
        });

        return Response.json({ success: true });

    } 
    catch (error) {
        return Response.json(
            { success: false, message: `${error}` },
            { status: 500 }
        );
    }
}