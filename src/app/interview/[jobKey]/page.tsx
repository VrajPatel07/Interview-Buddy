import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma" 
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import InterviewLanding from "@/components/interview/InterviewLanding"



export default async function InterviewEntryPage({ params } : { params : Promise<{ jobKey: string }> }) {
    
    const session = await auth();

    const {jobKey} = await params;

    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    const job = await prisma.job.findFirst({
        where: {
            jobKey
        },
        include: {
            company: true
        }
    })

    if (!job) {
        return notFound();
    }

    if (job.status !== "STARTED") {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Interview Unavailable</CardTitle>
                    <CardDescription>
                        This position is currently not accepting new interviews.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p> The job status is currently {job.status}. </p>
                </CardContent>
                <CardFooter>
                    <Button asChild>
                        <Link href="/profile">Return to Dashboard</Link>
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    // Check if this specific user already has a session for this job
    const existingSession = await prisma.interviewSession.findFirst({
        where: {
            candidateId : session.user.id,
            jobId : job.id
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
        <InterviewLanding
            job = {job}
            userId = {session.user.id}
        />
    )
}