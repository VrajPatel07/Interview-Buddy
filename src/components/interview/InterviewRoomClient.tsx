"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Clock, Loader2, Mic, MicOff, MessageSquare, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useDeepgram } from "@/hooks/useDeepgram";
import { saveAnswer, finishInterview } from "@/components/interview/actions";



export default function InterviewRoomClient({ session, jobKey }: any) {

    const router = useRouter();
    const questions = session.questions;


    const initialIndex = questions.findIndex((q: any) => !q.answerText) === -1
        ? 0
        : questions.findIndex((q: any) => !q.answerText);


    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(questions[initialIndex]?.timeLimit || 60);


    const timeoutHandledRef = useRef(false);


    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
    } = useDeepgram();


    const currentQuestion = questions[currentIndex];

    /* -------------------- Mic Auto Start -------------------- */
    useEffect(() => {
        timeoutHandledRef.current = false;
        setTimeLeft(currentQuestion.timeLimit);
        resetTranscript();
        startListening();

        return () => stopListening();
    }, [currentIndex]);


    /* -------------------- Timer -------------------- */
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev: number) => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [currentIndex]);


    /* -------------------- Timeout Detection -------------------- */
    useEffect(() => {
        if (timeLeft === 0 && !isSubmitting && !timeoutHandledRef.current) {
            timeoutHandledRef.current = true;
            handleTimeOut();
        }
    }, [timeLeft]);


    const handleTimeOut = () => {
        toast.warning("Time's up! Submitting your answer...");
        handleSubmit(true);
    };


    /* -------------------- Submit Logic -------------------- */
    const handleSubmit = async (force = false) => {
        
        if (isSubmitting) return;

        stopListening();
        setIsSubmitting(true);

        const finalAnswer = transcript.trim();

        if (!finalAnswer && !force) {
            toast.error("No speech detected. Please speak your answer.");
            setIsSubmitting(false);
            startListening();
            return;
        }

        try {
            await saveAnswer(
                currentQuestion.id,
                finalAnswer || "[NO ANSWER PROVIDED]"
            );

            if (currentIndex === questions.length - 1) {
                await finishInterview(session.id);
                router.push(`/interview/${jobKey}/result`);
            } else {
                setCurrentIndex((prev: number) => prev + 1);
            }
        }
        catch (error) {
            toast.error("Failed to save answer. Please try again.");
            startListening();
        }
        finally {
            setIsSubmitting(false);
        }
    };


    const progressPercentage = ((currentIndex + 1) / questions.length) * 100;


    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-zinc-950 relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-20" />

            <div className="w-full max-w-4xl space-y-8 relative z-10">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {session.job.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-zinc-400 border-zinc-700 bg-zinc-900/50">
                                Question {currentIndex + 1} of {questions.length}
                            </Badge>
                        </div>
                    </div>

                    <div className={`
                        flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
                        ${timeLeft < 10
                            ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse"
                            : "bg-zinc-900/80 border-zinc-800 text-indigo-400"}
                    `}>
                        <Clock className="w-4 h-4" />
                        <span className="font-mono text-lg font-bold tracking-widest">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                {/* Main Card */}
                <Card className="w-full bg-zinc-900/50 border-zinc-800 backdrop-blur-xl shadow-2xl overflow-hidden">

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-zinc-950">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>

                    <CardHeader className="space-y-6 pb-2">
                        {/* Question Content */}
                        <div className="space-y-2">
                            <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">
                                Current Question
                            </span>
                            <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100 leading-relaxed">
                                {currentQuestion.content}
                            </h3>
                        </div>

                        {/* Status Indicator */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                            <div className="flex items-center gap-2.5">
                                {isListening ? (
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                        </span>
                                        <span className="text-sm font-medium">Listening...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <MicOff className="w-4 h-4" />
                                        <span className="text-sm font-medium">Microphone Paused</span>
                                    </div>
                                )}
                            </div>

                            {/* Subtle hint */}
                            <span className="text-xs text-zinc-600 hidden sm:block">
                                Speak clearly and at a natural pace
                            </span>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-4">
                        <div className="relative">
                            <ScrollArea className="h-64 w-full rounded-xl border border-zinc-800 bg-zinc-950/30 p-4 pl-10 shadow-inner">
                                {transcript ? (
                                    <p className="text-lg leading-relaxed text-zinc-300">
                                        {transcript}
                                    </p>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
                                        {isListening ? (
                                            <>
                                                <Mic className="w-8 h-8 text-zinc-700 animate-pulse" />
                                                <p className="text-sm">Start speaking to see your answer here...</p>
                                            </>
                                        ) : (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin text-zinc-700" />
                                                <p className="text-sm">Connecting to audio server...</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>

                        {/* Warning if transcript is empty but mic is on */}
                        {isListening && !transcript && timeLeft < 45 && (
                            <Alert className="mt-4 bg-yellow-500/10 border-yellow-500/20 text-yellow-500 py-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-xs ml-2">
                                    We aren't detecting any speech yet. Please check your microphone.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 pb-8 bg-zinc-950/30 border-t border-zinc-800/50">
                        <p className="text-xs text-zinc-500 order-2 sm:order-1">
                            {timeLeft === 0
                                ? "Time has expired."
                                : "Answer will auto-submit when the timer reaches zero."}
                        </p>

                        <Button
                            size="lg"
                            className="w-full cursor-pointer sm:w-auto min-w-40 order-1 sm:order-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.5)] transition-all"
                            onClick={() => handleSubmit(false)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Saving Answer...
                                </>
                            ) : (
                                <>
                                    Submit Answer
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}