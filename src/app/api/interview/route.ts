import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateQuestionsFromPDF } from "@/lib/question-generator";


export const maxDuration = 60;


type QuestionType = {
    content : string;
    difficulty : "EASY" | "MEDIUM" | "HARD";
    timeLimit : number;
}


export async function POST(req: Request) {
    try {

        const session = await auth();

        if (!session || !session.user?.email || !session.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { jobId, resumeUrl } = await req.json();

        if (!jobId || !resumeUrl) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const job = await prisma.job.findUnique({
            where : { id : jobId }
        });

        if (!job) {
            return NextResponse.json(
                { success: false, message: "Job not found" },
                { status: 404 }
            );
        }

        if (job.status !== "STARTED") {
            return NextResponse.json(
                { success: false, message: "Job is not currently active" },
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
                { success: true, data: existingSession },
                { status: 200 }
            );
        }

        const questions = await generateQuestionsFromPDF(resumeUrl, job.title, job.description);

        if (!questions || questions.length === 0) {
            throw new Error("Failed to generate questions");
        }

        const interviewSession = await prisma.interviewSession.create({
            data: {
                candidateId: session.user.id,
                jobId: job.id,
                resumeUrl,
                // resumeText: safeResumeText,
                status: "IN_PROGRESS",
                questions: {
                    create: questions.map((q: QuestionType, index: number) => ({
                        content: q.content,
                        difficulty: q.difficulty,
                        orderIndex: index,
                        timeLimit: q.timeLimit
                    }))
                }
            },
            select: {
                id: true,
                status: true
            }
        });

        return NextResponse.json(
            { success: true, data: interviewSession },
            { status: 201 }
        );

    } 
    catch (error) {
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}