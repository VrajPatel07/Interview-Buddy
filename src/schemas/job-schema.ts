import * as z from "zod";


export const createJobSchema = z.object({
    title: z
        .string()
        .nonempty("Job title is required")
        .max(50, "Job title should be at most 50 characters"),

    description: z
        .string()
        .nonempty("Job description is required")
        .max(5000, "Job description should be at most 5000 characters"),
});


export const updateJobSchema = createJobSchema.extend({
    status: z.enum(["DRAFT", "STARTED", "COMPLETED"]),
});



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