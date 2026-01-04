"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Loader2, LogIn } from "lucide-react"

import { signInSchema } from "@/schemas/sign-in-schema"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function SignInPage() {

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">("CANDIDATE")

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function submitHandler(data: z.infer<typeof signInSchema>) {
        
        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                role : role,
                redirect: false
            })

            if (!result) {
                toast.error("Something went wrong");
                return;
            }

            if (result.error) {
                toast.error("Invalid credentials", {
                    description: "Please check your email and password"
                })
                return;
            }

            toast.success("Login successful");
            form.reset();
            router.push("/profile");

        } 
        catch (error) {
            toast.error("Something went wrong")
        } 
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden px-4 py-8">

            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
            <div className="absolute left-0 top-0 w-125 h-125 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute right-0 bottom-0 w-125 h-125 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md space-y-6 relative z-10">

                {/* Header Section */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Welcome Back
                    </h2>
                    <p className="text-zinc-400 text-sm">
                        Join the AI-powered interview revolution.
                    </p>
                </div>

                {/* Role Switcher */}
                <div className="grid grid-cols-2 p-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm shadow-sm">
                    {["CANDIDATE", "RECRUITER"].map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setRole(item as "CANDIDATE" | "RECRUITER")}
                            className={cn(
                                "relative py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center",
                                role === item
                                    ? "text-white shadow-sm bg-zinc-800 ring-1 ring-white/5"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                            )}
                        >
                            {item === "CANDIDATE" ? "I'm a Candidate" : "I'm a Recruiter"}
                        </button>
                    ))}
                </div>

                {/* Login Card */}
                <Card className="w-full border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-xl overflow-hidden">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-xl text-white font-semibold flex items-center gap-2">
                            <LogIn className="w-5 h-5 text-indigo-400" />
                            Sign In
                        </CardTitle>
                        <CardDescription className="text-zinc-400 text-sm">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            id="candidate-signin-form"
                            onSubmit={form.handleSubmit(submitHandler)}
                            className={cn("space-y-5", isLoading && "opacity-70 pointer-events-none")}
                        >
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-zinc-300 text-xs font-medium mb-2 block">
                                            Email Address
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            className="bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500 h-11 transition-all placeholder:text-zinc-600"
                                        />
                                        {fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <div className="flex items-center justify-between mb-2">
                                            <FieldLabel className="text-zinc-300 text-xs font-medium block">
                                                Password
                                            </FieldLabel>
                                            <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                                Forgot password?
                                            </a>
                                        </div>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            className="bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500 h-11 transition-all placeholder:text-zinc-600"
                                        />
                                        {fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-5 border-t border-zinc-800/50 pt-6 bg-zinc-900/30">
                        <Button
                            type="submit"
                            form="candidate-signin-form"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium h-11 transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.5)]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : "Sign In"}
                        </Button>

                        <div className="text-center text-sm text-zinc-500">
                            Don't have an account?{" "}
                            <a
                                href="/sign-up"
                                className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium underline-offset-4 hover:underline"
                            >
                                Create Account
                            </a>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}