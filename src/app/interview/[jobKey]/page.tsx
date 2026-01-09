import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Ban, ArrowLeft } from "lucide-react"

import InterviewLanding from "@/components/interview/InterviewLanding"




export default async function InterviewEntryPage({ params }: { params: Promise<{ jobKey: string }> }) {

    const session = await auth();
    const { jobKey } = await params;

    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    const job = await prisma.job.findFirst({
        where: { jobKey },
        include: { company: true }
    })

    if (!job) {
        return notFound();
    }

    if (job.status !== "STARTED") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 px-4">
                <Card className="w-full max-w-md bg-zinc-900/50 border-zinc-800 backdrop-blur-xl shadow-xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                            <Ban className="w-6 h-6 text-red-400" />
                        </div>
                        <CardTitle className="text-white">Interview Unavailable</CardTitle>
                        <CardDescription className="text-zinc-400">
                            This position is currently not accepting new interviews.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-zinc-500 bg-zinc-950/50 py-2 px-4 rounded-lg inline-block border border-zinc-800">
                            Current Status : <span className="font-medium text-zinc-300">{job.status}</span>
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button
                            asChild
                            className="bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] transition-all"
                        >
                            <Link href="/profile">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Return to Profile
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // Check existing session
    const existingSession = await prisma.interviewSession.findFirst({
        where: {
            candidateId: session.user.id,
            jobId: job.id
        },
    })

    if (existingSession) {
        if (existingSession.status === "COMPLETED") {
            redirect(`/interview/${jobKey}/result`)
        }
        if (existingSession.status === "IN_PROGRESS") {
            redirect(`/interview/${jobKey}/room`)
        }
    }

    return (
        <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 sm:p-8">
            <InterviewLanding
                job={job}
                userId={session.user.id}
            />
        </div>
    )
}