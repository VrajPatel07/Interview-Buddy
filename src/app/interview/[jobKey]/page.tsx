"use client";


import { use } from 'react';
import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import InterviewSession from "@/components/interview/InterviewSession";
import { useSession } from "next-auth/react";


export default function Interview({ params }: { params: Promise<{ jobKey: string }> }) {

    const { data: session } = useSession();

    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [open, setOpen] = useState(true);
    const [interviewSession, setInterviewSession] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const { jobKey } = use(params);


    const handleCreateSession = async () => {
        try {
            if (!resumeUrl || !session?.user?.id) return;

            setLoading(true);

            const response = await axios.post("/api/interview", {
                jobKey,
                resumeUrl
            });

            if (response.data.success) {
                setInterviewSession(response.data);
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };


    return (
        <div>

            <Dialog open={open}>
                <DialogContent>

                    <DialogHeader>
                        <DialogTitle>Upload Resume</DialogTitle>
                    </DialogHeader>

                    <FileUpload
                        fileType="PDF"
                        setFileURL={(url) => setResumeUrl(url)}
                    />

                    <Button
                        disabled={!resumeUrl}
                        onClick={() => {
                            setOpen(false);
                            handleCreateSession();
                        }}
                    >
                        Continue
                    </Button>

                </DialogContent>
            </Dialog>

            {!open && (
                <>
                    <div>
                        <p>Speak slowly</p>
                        <p>Read the question carefully</p>
                        <p>Answer within given time</p>
                    </div>

                    <Button disabled={!interviewSession || loading}>
                        Start Interview
                    </Button>

                    {interviewSession && (
                        <InterviewSession interviewSession={interviewSession} />
                    )}
                </>
            )}

        </div>
    )
}