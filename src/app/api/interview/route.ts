import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { extractResumeText } from "@/lib/resume-extractor";
import { generateQuestions } from "@/lib/question-generator";


type QuestionType = {
    content: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    timeLimit: number;
}


export async function POST(req: Request) {
    try {

        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { jobKey, resumeUrl } = body;

        if (!jobKey || !resumeUrl) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        try {
            new URL(resumeUrl);
        } 
        catch {
            return NextResponse.json(
                { success: false, message: "Invalid resume URL" },
                { status: 400 }
            );
        }

        const job = await prisma.job.findFirst({
            where: { jobKey }
        });

        if (!job) {
            return NextResponse.json(
                { success: false, message: "Job not found" },
                { status: 404 }
            );
        }

        if (job.status === "COMPLETED") {
            return NextResponse.json(
                { success: false, message: "Job expired" },
                { status: 400 }
            );
        }

        const existingSession = await prisma.interviewSession.findFirst({
            where: {
                candidateId: session.user.id,
                jobId: job.id
            }
        });

        if (existingSession) {
            return NextResponse.json(
                { success: false, message: "Interview session already exists for this job" },
                { status: 409 }
            );
        }

        const resumeText = await extractResumeText(resumeUrl);

        if (!resumeText || resumeText.trim().length === 0) {
            return NextResponse.json(
                { success: false, message: "Failed to extract text from resume" },
                { status: 400 }
            );
        }

        const questions = await generateQuestions(resumeText, job.title, job.description);

        if (!questions || questions.length !== 7) {
            return NextResponse.json(
                { success: false, message: "Failed to generate questions" },
                { status: 500 }
            );
        }

        const interviewSession = await prisma.interviewSession.create({
            data: {
                candidateId: session.user.id,
                jobId: job.id,
                resumeUrl,
                resumeText,
                questions: {
                    create: questions.map((q: QuestionType, index: number) => ({
                        content: q.content,
                        difficulty: q.difficulty,
                        orderIndex: index,
                        timeLimit: q.timeLimit
                    }))
                }
            },
            include: {
                candidate: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                job: {
                    select: {
                        id: true,
                        title: true,
                        description: true
                    }
                },
                questions: {
                    orderBy: {
                        orderIndex: 'asc'
                    }
                }
            }
        });

        return NextResponse.json(
            { success: true, data: interviewSession },
            { status: 201 }
        );

    } 
    catch (error) {
        
        console.error("Error creating interview session:", error);

        // Provide more specific error messages
        if (error instanceof Error) {
            if (error.message.includes("resume")) {
                return NextResponse.json(
                    { success: false, message: "Failed to process resume" },
                    { status: 400 }
                );
            }
            if (error.message.includes("generate")) {
                return NextResponse.json(
                    { success: false, message: "Failed to generate questions" },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );

    }
}