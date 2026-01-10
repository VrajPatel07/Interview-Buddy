"use server";


import prisma from "@/lib/prisma";
import { generateInterviewResult } from "@/lib/evaluate-interview"; 



export async function saveAnswer(questionId: string, answerText: string) {
    try {
        await prisma.question.update({
            where: { id: questionId },
            data: { answerText }
        });
        return { success: true };
    } 
    catch (error) {
        throw new Error("Failed to save answer");
    }
}



export async function finishInterview(sessionId: string) {
    try {
        
        // Fetch the full session data (Job context + All Q&A)
        const session = await prisma.interviewSession.findUnique({
            where: { id: sessionId },
            include: {
                job: {
                    select: { title: true, description: true }
                },
                questions: {
                    orderBy: { orderIndex: 'asc' },
                    select: { content: true, answerText: true, difficulty: true }
                }
            }
        });

        if (!session) throw new Error("Session not found");

        // Generate Score & Feedback
        const gradingResult = await generateInterviewResult(
            session.job.title,
            session.job.description,
            session.questions
        );

        await prisma.interviewSession.update({
            where: { id: sessionId },
            data: {
                status: "COMPLETED",
                totalScore: gradingResult.totalScore,
                feedback: gradingResult.feedback
            },
        });

        return { success: true };

    } 
    catch (error) {
        console.error("Failed to finish interview:", error);
        throw new Error("Failed to finish interview");
    }
}