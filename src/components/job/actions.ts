"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import * as z from "zod";

import { createJobSchema, updateJobSchema } from "@/schemas/job-schema";




export async function updateJobAction(jobId: string, data: z.infer<typeof updateJobSchema>) {

    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    updateJobSchema.parse(data);

    await prisma.job.update({
        where: {
            id: jobId,
            companyId: session.user.id
        },
        data: {
            title: data.title,
            description: data.description,
            status: data.status
        }
    });

    return { success: true };

}


export async function createJobAction(data: unknown) {

    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const parsed = createJobSchema.parse(data);

    const domain = process.env.DOMAIN;

    if (!domain) {
        throw new Error("DOMAIN not configured");
    }

    const jobKey = crypto.randomUUID();

    await prisma.job.create({
        data: {
            title: parsed.title,
            description: parsed.description,
            status: "DRAFT",
            isPublic: false,
            companyId: session.user.id,
            interviewLink: `${domain}/interview/${jobKey}`,
            jobKey
        },
    });

    return { success: true };

}



export async function deleteJobAction(jobId: string) {

    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await prisma.job.delete({
        where: {
            id: jobId
        }
    });

    return { success: true };

}