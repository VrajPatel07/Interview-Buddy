import {z} from "zod";


export const recruiterSignUpSchema =  z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
    companyDescription: z.string().max(500, { message : "Company description should be of atmost 500 characters" }).optional(),
    companyWebsite: z.string().url({ message: "Invalid URL" }).optional().or(z.literal(""))
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});