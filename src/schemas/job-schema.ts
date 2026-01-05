import {z} from "zod";


export const jobSchema =  z.object({
    title: z.string().nonempty({message : "Job title is required"}).max(50, {message : "Job title should be of almost 50 characters"}),
    description: z.string().max(5000, { message : "Job description should be of atmost 5000 characters" })
})