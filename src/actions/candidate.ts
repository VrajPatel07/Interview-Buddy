"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import prisma from "@/lib/prisma";
import axios from "axios";


type candidateSchema = {
    name: string,
    image?: string
};

export async function updateCandidateProfile(data: candidateSchema) {

    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                image: data.image || null
            }
        });

        revalidatePath("/profile");

        return { success: true };
    }
    catch (error) {
        const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || "Updation failed" : "Unexpected error"
        return {success : false, message : errorMessage}
    }
    
}
