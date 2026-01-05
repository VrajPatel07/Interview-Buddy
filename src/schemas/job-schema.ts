import { z } from "zod";


export const jobSchema = z.object({
    title: z.string().nonempty({ message: "Job title is required" }).max(50, { message: "Job title should be of almost 50 characters" }),
    description: z.string().max(5000, { message: "Job description should be of atmost 5000 characters" })
})



export enum JobStatus {
    DRAFT = "DRAFT",
    STARTED = "STARTED",
    COMPLETED = "COMPLETED"
}

export enum SessionStatus {
    WAITING = "WAITING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
}


export interface JobQuestion {
    content: string;
    orderIndex: number;
    timeLimit: number;
    answerText?: string; 
    score?: number;
}


export interface SessionCandidate {
    name: string;
    email: string;
}


export interface InterviewSession {
    id: string;
    status: SessionStatus;

    totalScore?: number;
    feedback?: string;
    resumeUrl?: string;

    startedAt: Date;
    completedAt: Date;

    candidate: SessionCandidate;
    questions: JobQuestion[];
}


export interface JobSchema {
    id: string;
    title: string;
    description: string;

    status: JobStatus;
    interviewLink?: string;

    createdAt: Date;
    updatedAt: Date;

    sessions: InterviewSession[];
}