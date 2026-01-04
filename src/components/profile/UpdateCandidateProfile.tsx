"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, UserCircle, Save, X, Camera } from "lucide-react"
import { useRouter } from "next/navigation"

import { updateCandidateProfile } from "@/actions/candidate"
import FileUpload from "../FileUpload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"


const candidateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    image: z.string().url().optional().or(z.literal(""))
})

type Props = {
    user: z.infer<typeof candidateSchema>
}

export default function UpdateCandidateProfile({ user }: Props) {

    const router = useRouter()
    const [fileURL, setFileURL] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof candidateSchema>>({
        resolver: zodResolver(candidateSchema),
        defaultValues: user
    })

    const onSubmit = async (data: z.infer<typeof candidateSchema>) => {

        setIsLoading(true)

        try {
            const response = await updateCandidateProfile({
                ...data,
                image: fileURL || data.image
            })

            if (!response.success) {
                toast.error(response.message)
                return
            }

            toast.success("Profile updated successfully")
            router.back()
            router.refresh()

        } 
        catch (e: any) {
            toast.error("Unexpected error occurred")
        } 
        finally {
            setIsLoading(false)
        }

    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden px-4 py-12">
            
            <Card className="w-full max-w-lg border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-xl relative z-10">

                <CardHeader>
                    <CardTitle className="text-xl text-white font-semibold flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-indigo-400" />
                        Update Profile
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Manage your public profile information
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        id="update-profile-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={cn("space-y-6", isLoading && "opacity-70 pointer-events-none")}
                    >
                        {/* Avatar Upload Section */}
                        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">

                            <Avatar className="w-20 h-20 border-2 border-zinc-800 shadow-md">
                                <AvatarImage src={fileURL || form.getValues("image")} />
                                <AvatarFallback className="bg-zinc-800 text-zinc-500">
                                    {user.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-2 w-full">
                                <FieldLabel className="text-zinc-300 font-medium">Profile Picture</FieldLabel>
                                <div className="w-full">
                                    <FileUpload
                                        fileType="IMAGE"
                                        setFileURL={(url) => {
                                            setFileURL(url)
                                            form.setValue("image", url, { shouldDirty: true })
                                        }}
                                    />
                                    <p className="text-[10px] text-zinc-500 mt-2">
                                        Supports JPG, JPEG, PNG. Max size 5MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-zinc-300 text-xs font-medium mb-1.5 block">
                                            Full Name
                                        </FieldLabel>
                                        <Input 
                                            {...field} 
                                            className="bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

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
        </div>
    )
}