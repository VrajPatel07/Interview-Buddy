"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { AlertTriangle, Loader2, UserCircle } from "lucide-react"

import { candidateSignUpSchema } from "@/schemas/candidate-signup-schema"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"



export default function CandidateSignUp() {

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof candidateSignUpSchema>>({
        resolver: zodResolver(candidateSignUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function submitHandler(data: z.infer<typeof candidateSignUpSchema>) {
        try {
            setIsLoading(true)

            const response = await axios.post("/api/sign-up", {
                name: data.name,
                email: data.email,
                password: data.password,
                role: "CANDIDATE"
            })

            if (response.data.success) {
                toast.success("Account created successfully!")
            }

            form.reset()
            router.push("/sign-in")
        }
        catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || "Signup failed"
                : "Unexpected error"

            toast.error(errorMessage)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-xl">

            <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-indigo-400" />
                    Candidate Profile
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Start your interview preparation journey
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    id="candidate-signup-form"
                    onSubmit={form.handleSubmit(submitHandler)}
                    className={cn("space-y-4", isLoading && "opacity-70 pointer-events-none")}
                >
                    <div className="space-y-4">

                        {/* Name Field */}
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-zinc-300 text-xs font-medium block mb-1.5">
                                        Candidate Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        placeholder="John Doe"
                                        className={cn(
                                            "bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
                                            fieldState.invalid && "border-red-500 focus:border-red-500"
                                        )}
                                    />
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Email Field */}
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-zinc-300 text-xs font-medium block mb-1.5">
                                        Candidate Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="name@example.com"
                                        className={cn(
                                            "bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
                                            fieldState.invalid && "border-red-500 focus:border-red-500"
                                        )}
                                    />

                                    {/* Warning Message */}
                                    <p className="text-[11px] text-amber-500/90 flex items-center gap-1.5 mt-1.5 font-medium">
                                        <AlertTriangle className="w-3 h-3" />
                                        Note: This email address cannot be changed later.
                                    </p>

                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Password Field */}
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-zinc-300 text-xs font-medium block mb-1.5">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="••••••••"
                                        className={cn(
                                            "bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
                                            fieldState.invalid && "border-red-500 focus:border-red-500"
                                        )}
                                    />
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Confirm Password Field */}
                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-zinc-300 text-xs font-medium block mb-1.5">
                                        Confirm Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="••••••••"
                                        className={cn(
                                            "bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
                                            fieldState.invalid && "border-red-500 focus:border-red-500"
                                        )}
                                    />
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t border-zinc-800/50 pt-6">
                <Button
                    type="submit"
                    form="candidate-signup-form"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-6 transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.5)] cursor-pointer"
                >
                    {
                        isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating Account...
                            </>
                        ) : "Create Account"
                    }
                </Button>

                <div className="text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                        Sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}