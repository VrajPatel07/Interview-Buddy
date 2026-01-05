import prisma from "@/lib/prisma";
import { auth } from "@/auth";



export async function POST(req : Request) {
    try {

        const session = await auth();

        if (!session || !session.user?.id) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { title, description } = await req.json();

        const domain = process.env.DOMAIN;

        if (!domain) {
            return Response.json(
                { success: false, message: "DOMAIN not configured" },
                { status: 500 }
            );
        }

        const job = await prisma.job.create({
            data: {
                title,
                description,
                isPublic: false,
                status: "DRAFT",
                companyId: session.user.id
            }
        });

        const interviewLink = `${domain}/interview/${job.id}`;

        await prisma.job.update({
            where: { id: job.id },
            data: { interviewLink }
        });

        return Response.json(
            {
                success: true
            },
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



export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user?.id) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const jobs = await prisma.job.findMany({
            where: {
                companyId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                interviewLink: true,
                createdAt: true,
                updatedAt: true,
                sessions: {
                    select: {
                        id: true,
                        status: true,
                        totalScore: true,
                        feedback: true,
                        resumeUrl: true,
                        startedAt: true,
                        completedAt: true,
                        candidate: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                        questions: {
                            select: {
                                content: true,
                                orderIndex: true,
                                timeLimit: true,
                                answerText: true,
                                score: true,
                            },
                            orderBy: {
                                orderIndex: "asc",
                            },
                        },
                    },
                },
            },
        });

        return Response.json({
            success: true,
            data: jobs,
        });

    }
    catch (error) {
        return Response.json(
            { success: false, message: `Error: ${error}` },
            { status: 500 }
        );
    }
}