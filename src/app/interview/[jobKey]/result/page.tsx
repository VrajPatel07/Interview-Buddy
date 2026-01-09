import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Briefcase, Sparkles, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";



export default async function InterviewResultPage({ params }: { params: Promise<{ jobKey: string }> }) {

    const session = await auth();
    const { jobKey } = await params;

    if (!session?.user?.id) {
        redirect("sign-in");
    }

    const interviewSession = await prisma.interviewSession.findFirst({
        where: {
            candidateId: session.user.id,
            job: { jobKey }
        },
        include: { job: true },
    });

    // Don't show success page if they haven't actually finished
    if (!interviewSession || interviewSession.status !== "COMPLETED") {
        redirect(`/interview/${jobKey}`);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-950 relative overflow-hidden">

            <Card className="max-w-xl w-full text-center bg-zinc-900/50 border-zinc-800 backdrop-blur-xl shadow-2xl overflow-hidden">

                <CardHeader className="pt-1 pb-1">
                    <CardTitle className="text-3xl font-bold text-white tracking-tight">
                        Interview Completed!
                    </CardTitle>
                    <CardDescription className="text-lg text-zinc-400 mt-2">
                        Your responses have been recorded successfully.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 px-8">

                    {/* Job Context */}
                    <div className="flex items-center justify-center gap-2 text-zinc-300 bg-zinc-950/50 py-2 px-4 rounded-full border border-zinc-800/50 mx-auto w-fit">
                        <Briefcase className="w-4 h-4 text-indigo-400" />
                        <span>Role : <span className="font-semibold text-white">{interviewSession.job.title}</span></span>
                    </div>

                    <Separator className="bg-zinc-800" />

                    {/* Feedback Section */}
                    {interviewSession.feedback ? (
                        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-6 text-left space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles className="w-24 h-24 text-indigo-500" />
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">
                                    AI Feedback Summary
                                </h3>
                            </div>

                            <p className="text-zinc-300 text-sm leading-relaxed relative z-10">
                                {interviewSession.feedback}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-zinc-950/30 border border-zinc-800 rounded-xl p-6">
                            <p className="text-zinc-500 text-sm italic">
                                Detailed feedback is being generated and will be available in your profile shortly.
                            </p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row gap-3 px-8 pb-8 pt-2">
                    <Button
                        asChild
                        className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    >
                        <Link href="/profile">
                            <Home className="w-4 h-4 mr-2" />
                            Return to Profile
                        </Link>
                    </Button>
                </CardFooter>

            </Card>
        </div>
    );
}