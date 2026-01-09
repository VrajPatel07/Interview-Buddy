"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import FileUpload from "../FileUpload";
import axios from "axios"


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
        <div className="container max-w-3xl py-10">
            <Card>

                <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>
                        Position at {job.company.name}
                    </CardDescription>
                </CardHeader>

                <CardContent>

                    <div>
                        <h3>Job Description</h3>
                        <p>{job.description}</p>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        <h3>Upload Resume</h3>
                        <p style={{ marginBottom: "10px", fontSize: "0.9rem", color: "#666" }}>
                            Upload your CV (PDF) to generate personalized interview questions.
                        </p>

                        <FileUpload
                            fileType="PDF"
                            setFileURL={setResumeUrl}
                        />
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Before you start</AlertTitle>
                            <AlertDescription>
                                Once you click start, the timer will begin. You cannot pause the interview.
                                Ensure you have a stable internet connection and 15-20 minutes of uninterrupted time.
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Checkbox
                            id="terms"
                            checked={isAgreed}
                            onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
                        />
                        <Label htmlFor="terms">
                            I understand that this interview is timed and my responses will be recorded.
                        </Label>
                    </div>

                </CardContent>

                <CardFooter>
                    <Button
                        size="lg"
                        onClick={handleStartInterview}
                        disabled={isLoading || !resumeUrl || !isAgreed}
                        className="w-full"
                    >
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating Questions...
                                </>
                            ) : (
                                "Start Interview"
                            )
                        }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}