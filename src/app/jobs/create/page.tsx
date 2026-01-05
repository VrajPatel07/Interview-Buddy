"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


import { Loader2, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { jobSchema } from "@/schemas/job-schema"
import { cn } from "@/lib/utils"



export default function CreateJob() {

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof jobSchema>>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title:"",
            description:""
        }
    })

    async function submitHandler(data: z.infer<typeof jobSchema>) {
        try {
            setIsLoading(true)

            const response = await axios.post("/api/job", {
                title : data.title,
                description : data.description
            });

            if (response.data.success) {
                toast.success("Job created successfully!");
                form.reset();
                router.back();
            }

        }
        catch (error) {
            const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || "Job Creation Failed" : "Unexpected error"
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
                    Job Details
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Create job and hire candidates
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    id="job-create-form"
                    onSubmit={form.handleSubmit(submitHandler)}
                    className={cn("space-y-6", isLoading && "opacity-70 pointer-events-none")}
                >
                    <div className="pt-2 space-y-4">
                        <div className="grid gap-4">

                            {/* Company Name Field */}
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-zinc-300 text-xs font-medium mb-1.5 block">
                                            Job Title
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            className="bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            {/* Description Field */}
                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-zinc-300 text-xs font-medium mb-1.5 block">
                                            Job Description
                                        </FieldLabel>
                                        <textarea
                                            {...field}
                                            rows={4}
                                            className="flex min-h-20 w-full rounded-md border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
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
                    form="job-create-form"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-6 transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.5)] cursor-pointer"
                >
                    {
                        isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating Job...
                            </>
                        ) : "Create"
                    }
                </Button>
            </CardFooter>
        </Card>
    )
}