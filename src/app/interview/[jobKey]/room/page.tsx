import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import InterviewRoomClient from "@/components/interview/InterviewRoomClient";



export default async function InterviewRoomPage({ params }: { params: Promise<{ jobKey: string }> }) {

    const { jobKey } = await params;
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    const interviewSession = await prisma.interviewSession.findFirst({
        where: {
            candidateId: session.user.id,
            job: { jobKey }
        },
        include: {
            questions: {
                orderBy: { orderIndex: "asc" },
            },
            job: {
                select: { title: true },
            }
        }
    });

    if (!interviewSession) {
        redirect(`/interview/${jobKey}`);
    }

    if (interviewSession.status === "COMPLETED") {
        redirect(`/interview/${jobKey}/result`);
    }

    return (
        <div className="min-h-screen w-full bg-zinc-950">
            <InterviewRoomClient
                session={interviewSession}
                jobKey={jobKey}
            />
        </div>
    );
}