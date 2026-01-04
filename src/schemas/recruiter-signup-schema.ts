import {z} from "zod";


export const recruiterSignUpSchema =  z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
    description: z.string().max(500, { message : "Company description should be of atmost 500 characters" }).optional(),
    website: z.string().url({ message: "Invalid URL" }).optional().or(z.literal(""))
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});