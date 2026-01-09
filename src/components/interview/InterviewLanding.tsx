"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, AlertCircle, FileText, CheckCircle2, Clock, Mic, Wifi } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import FileUpload from "../FileUpload";


interface InterviewLandingProps {
    job: {
        id: string
        title: string
        description: string
        jobKey?: string | null
        company: {
            name: string
        }
    }
    userId: string
}


export default function InterviewLanding({ job, userId }: InterviewLandingProps) {

    const router = useRouter()
    const [resumeUrl, setResumeUrl] = useState<string>("")
    const [isAgreed, setIsAgreed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


    const handleStartInterview = async () => {
        if (!resumeUrl) {
            toast.error("Please upload your resume to continue")
            return
        }
        if (!isAgreed) {
            toast.error("Please agree to the terms")
            return;
        }

        setIsLoading(true)

        try {
            const response = await axios.post("/api/interview", {
                jobId: job.id,
                resumeUrl
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to start session")
            }

            toast.success("Interview session created. Redirecting...")
            router.push(`/interview/${job.jobKey}/room`)

        } 
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong")
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-3xl bg-zinc-900/50 border-zinc-800 backdrop-blur-xl shadow-2xl overflow-hidden">

            <CardHeader className="pb-6 border-b border-zinc-800/50 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-3xl font-bold text-white tracking-tight">
                            {job.title}
                        </CardTitle>
                        <CardDescription className="text-lg text-zinc-400 mt-1">
                            {job.company.name}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-8 pt-8 px-6 sm:px-8">

                {/* Job Description Section */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        Job Description
                    </h3>
                    <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50 text-zinc-400 text-sm leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                        {job.description}
                    </div>
                </div>

                {/* Resume Upload Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                            Upload Resume
                        </h3>
                        <span className="text-xs text-zinc-500">Required (PDF only)</span>
                    </div>

                    <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50">
                        <p className="text-sm text-zinc-400 mb-4">
                            We use your CV to generate personalized technical questions relevant to your experience.
                        </p>
                        <FileUpload
                            fileType="PDF"
                            setFileURL={setResumeUrl}
                        />
                    </div>
                </div>

                {/* Instructions Alert */}
                <Alert className="bg-indigo-950/20 border-indigo-500/20 text-indigo-200">
                    <AlertCircle className="h-5 w-5 text-indigo-400" />
                    <div className="ml-2">
                        <AlertTitle className="text-indigo-300 font-semibold mb-2">
                            Important Instructions
                        </AlertTitle>
                        <AlertDescription className="text-sm text-indigo-200/80 space-y-2">
                            <ul className="list-disc pl-4 space-y-1">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1"><Clock className="w-3 h-3 inline" /></span>
                                    Once you click start, the timer begins. The session cannot be paused.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1"><Wifi className="w-3 h-3 inline" /></span>
                                    Ensure a stable internet connection and 15-20 minutes of uninterrupted time.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1"><Mic className="w-3 h-3 inline" /></span>
                                    Wait for the microphone indicator to activate before speaking.
                                </li>
                                <li>
                                    Real-time transcription may have a slight delay—this is normal. Don't panic, just keep speaking naturally.
                                </li>
                            </ul>
                        </AlertDescription>
                    </div>
                </Alert>

                {/* Agreement Checkbox */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                    <Checkbox
                        id="terms"
                        checked={isAgreed}
                        onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
                        className="mt-1 border-zinc-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    />
                    <Label htmlFor="terms" className="text-sm text-zinc-400 leading-relaxed cursor-pointer">
                        I confirm that I have read the instructions, my equipment is ready, and I consent to the recording of this interview session for evaluation purposes.
                    </Label>
                </div>

            </CardContent>

            <CardFooter className="px-6 sm:px-8 pb-8 pt-2">
                <Button
                    size="lg"
                    onClick={handleStartInterview}
                    disabled={isLoading || !resumeUrl || !isAgreed}
                    className="w-full cursor-pointer text-base font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.5)] transition-all duration-300"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Preparing Interview Room...
                        </>
                    ) : (
                        "Start Interview Session"
                    )}
                </Button>
            </CardFooter>

        </Card>
    )
}