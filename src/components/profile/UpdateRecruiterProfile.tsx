"use client";

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, Building2, Save, X } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

import FileUpload from "../FileUpload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export const recruiterSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
    description: z.string().max(500, { message: "Company description should be of at most 500 characters" }).optional(),
    website: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
    logo: z.string().url().optional().or(z.literal(""))
})

type Props = {
    recruiter: z.infer<typeof recruiterSchema>
}

export default function UpdateRecruiterProfile({ recruiter }: Props) {

    const router = useRouter()
    const [fileURL, setFileURL] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof recruiterSchema>>({
        resolver: zodResolver(recruiterSchema),
        defaultValues: recruiter
    })

    const onSubmit = async (data: z.infer<typeof recruiterSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.put("/api/user", {
                ...data,
                logo: fileURL || data.logo
            })

            if (!response.data.success) {
                toast.error(response.data.message)
                return;
            }

            toast.success("Company profile updated successfully");
            router.back();
            router.refresh();

        }
        catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || "Update failed"
                : "Unexpected error"

            toast.error(errorMessage);
        }
        finally {
            setIsLoading(false)
        }
    }

    // CHANGED: Removed max-h, overflow, and flex-col to allow natural document flow
    return (
        <Card className="w-full border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-xl">

            <CardHeader>
                <CardTitle className="text-xl text-white font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    Update Company Profile
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Manage your company details and branding
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    id="update-recruiter-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn("space-y-6", isLoading && "opacity-70 pointer-events-none")}
                >
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                        <Avatar className="w-20 h-20 border-2 border-zinc-800 shadow-md bg-zinc-950">
                            <AvatarImage src={fileURL || form.getValues("logo")} className="object-cover" />
                            <AvatarFallback className="bg-zinc-800 text-zinc-500 text-4xl">
                                {recruiter.name[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2 w-full">
                            <FieldLabel className="text-zinc-300 font-medium">Company Logo</FieldLabel>
                            <div className="w-full">
                                <FileUpload
                                    fileType="IMAGE"
                                    setFileURL={(url) => {
                                        setFileURL(url)
                                        form.setValue("logo", url, { shouldDirty: true })
                                    }}
                                />
                                <p className="text-[10px] text-zinc-500 mt-2">
                                    Supports JPG, JPEG, PNG. Max size 5MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Company Name */}
                        <Controller
                            name="name"
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
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Email (Disabled) */}
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-zinc-300 text-xs font-medium mb-1.5 block">
                                        Email Address
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        type="email"
                                        disabled
                                        className="bg-zinc-900/50 border-zinc-800 text-zinc-500 cursor-not-allowed focus:ring-0"
                                    />
                                    <p className="text-[10px] text-zinc-500 mt-1">Email cannot be changed.</p>
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Website */}
                        <Controller
                            name="website"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-zinc-300 text-xs font-medium mb-1.5 block">
                                        Website URL
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        placeholder="https://company.com"
                                        className="bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Description */}
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-zinc-300 text-xs font-medium mb-1.5 block">
                                        About Company
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
                </form>
            </CardContent>

            <CardFooter className="flex justify-between items-center gap-4 border-t border-zinc-800/50 pt-6">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </Button>

                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.5)] transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin mr-2 w-4 h-4" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}