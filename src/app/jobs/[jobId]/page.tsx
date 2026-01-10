import { notFound } from "next/navigation";
import JobDashboard from "@/components/job/JobDashboard";
import prisma from "@/lib/prisma";


export default async function JobPage({ params }: { params: Promise<{ jobId: string }> }) {

    const { jobId } = await params;

    const job = await prisma.job.findUnique({
        where: {
            id: jobId,
        },
        include: {
            sessions: {
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    candidate: {
                        select: {
                            name: true,
                            email: true,
                            avatar: true,
                        },
                    },
                    questions: {
                        orderBy: {
                            orderIndex: "asc",
                        },
                        select: {
                            id: true,
                            content: true,
                            answerText: true,
                            difficulty: true,
                        },
                    },
                },
            },
        },
    });

    if (!job) {
        return notFound();
    }

    return (
        <main className="container mx-auto py-10 min-h-screen">
            <JobDashboard
                jobTitle={job.title}
                jobDescription={job.description}
                sessions={job.sessions}
            />
        </main>
    );
}