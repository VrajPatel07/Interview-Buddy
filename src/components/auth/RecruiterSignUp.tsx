"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


import { Loader2, Building2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { recruiterSignUpSchema } from "@/schemas/recruiter-signup-schema"
import { cn } from "@/lib/utils"
import Link from "next/link"



export default function RecruiterSignUp() {

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof recruiterSignUpSchema>>({
        resolver: zodResolver(recruiterSignUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            companyName: "",
            companyDescription: "",
            companyWebsite: ""
        }
    })

    async function submitHandler(data: z.infer<typeof recruiterSignUpSchema>) {
        try {
            setIsLoading(true)

            const companyRes = await axios.post("/api/create-company", {
                companyName: data.companyName,
                companyDescription: data.companyDescription,
                companyWebsite: data.companyWebsite,
                email: data.email
            })

            const companyId = companyRes.data?.data?.companyId

            if (!companyId) {
                throw new Error("Company creation failed")
            }

            const response = await axios.post("/api/sign-up", {
                name: data.name,
                email: data.email,
                password: data.password,
                role: "RECRUITER",
                companyId
            })

            if (response.data.success) {
                toast.success("Account created successfully!")
                form.reset()
                router.push("/sign-in")
            }

        }
        catch (error) {
            const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || "Signup failed" : "Unexpected error"
            toast.error(errorMessage)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-xl">

            <CardHeader>
                <CardTitle className="text-xl text-white font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    Recruiter Details
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Setup your organization profile
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    id="recruiter-signup-form"
                    onSubmit={form.handleSubmit(submitHandler)}
                    className={cn("space-y-6", isLoading && "opacity-70 pointer-events-none")}
                >
                    {/* Personal Info Section */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            Your Information
                        </h3>
                        <div className="grid gap-4">

                            {/* Name Field */}
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-zinc-300 text-xs font-medium mb-1.5 block">
                                            Recruiter Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            placeholder="John Doe"
                                            className="bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                                        />
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
                                        <FieldLabel className="text-zinc-300 text-xs font-medium mb-1.5 block">
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="••••••••"
                                            className="bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
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
                                        <FieldLabel className="text-zinc-300 text-xs font-medium mb-1.5 block">
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="••••••••"
                                            className="bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                                        />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                    </div>

                    {/* Company Info Section */}
                    <div className="pt-2 space-y-4">
                        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            Company Information
                        </h3>
                        <div className="grid gap-4">

                            {/* Company Name Field */}
                            <Controller
                                name="companyName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-zinc-300 text-xs font-medium mb-1.5 block">
                                            Company Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            className="bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        />

                                        {/* Warning Message */}
                                        <p className="text-[11px] text-amber-500/90 flex items-center gap-1.5 mt-1.5 font-medium">
                                            <AlertTriangle className="w-3 h-3" />
                                            Note: Company name cannot be changed later.
                                        </p>

                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            {/* Company Email Field */}
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-zinc-300 text-xs font-medium mb-1.5 block">
                                            Company Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="name@company.com"
                                            className="bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                                        />

                                        {/* Warning Message */}
                                        <p className="text-[11px] text-amber-500/90 flex items-center gap-1.5 mt-1.5 font-medium">
                                            <AlertTriangle className="w-3 h-3" />
                                            Note: This email cannot be changed later.
                                        </p>

                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            {/* Company Website Field */}
                            <Controller
                                name="companyWebsite"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-zinc-300 text-xs font-medium mb-1.5 block">
                                            Company Website
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            placeholder="https://"
                                            className="bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                                        />

                                        {/* Warning Message */}
                                        <p className="text-[11px] text-amber-500/90 flex items-center gap-1.5 mt-1.5 font-medium">
                                            <AlertTriangle className="w-3 h-3" />
                                            Note: Website URL cannot be changed later.
                                        </p>

                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            {/* Description Field */}
                            <Controller
                                name="companyDescription"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-zinc-300 text-xs font-medium mb-1.5 block">
                                            Description
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            rows={3}
                                            className="bg-zinc-950/50 border-zinc-800 text-zinc-100 resize-none focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                                        />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 border-t border-zinc-800/50 pt-6">
                <Button
                    type="submit"
                    form="recruiter-signup-form"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-6 transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.5)] cursor-pointer"
                >
                    {
                        isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating Profile...
                            </>
                        ) : "Create Recruiter Account"
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