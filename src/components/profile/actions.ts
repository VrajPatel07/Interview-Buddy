"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export async function getCandidateInterviews() {

    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    return prisma.interviewSession.findMany({
        where: {
            candidateId: session.user.id
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            job: {
                include: {
                    company: {
                        select: {
                            name: true,
                        }
                    }
                }
            },
            questions: {
                orderBy: {
                    orderIndex: "asc"
                },
                select: {
                    id: true,
                    content: true,
                    orderIndex: true,
                    answerText: true
                }
            }
        }
    });

}
