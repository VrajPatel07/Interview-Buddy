"use client";

import * as z from "zod";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Briefcase } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";


import { updateJobAction } from "./actions";
import { updateJobSchema } from "@/schemas/job-schema";


type UpdateJobForm = z.infer<typeof updateJobSchema>;


interface UpdateJobProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    job: any;
}


export default function UpdateJob({ open, setOpen, job }: UpdateJobProps) {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<UpdateJobForm>({
        resolver: zodResolver(updateJobSchema),
        defaultValues: {
            title: job.title,
            description: job.description,
            status: job.status
        },
    });

    const submitHandler = (data: UpdateJobForm) => {
        startTransition(async () => {
            try {
                await updateJobAction(job.id, data);
                toast.success("Job updated successfully");
                setOpen(false);
                router.refresh();
            } catch (error) {
                toast.error("Failed to update job");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-lg">

                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-indigo-500" />
                        Update Job
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Modify job details and current status.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4 py-2">

                    <Controller
                        name="title"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-zinc-300 text-xs font-medium">Job Title</FieldLabel>
                                <Input
                                    {...field}
                                    className="bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 text-zinc-100"
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-zinc-300 text-xs font-medium">Job Description</FieldLabel>
                                <textarea
                                    {...field}
                                    rows={4}
                                    className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="status"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-zinc-300 text-xs font-medium">Status</FieldLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                                        <SelectItem value="DRAFT" className="focus:bg-zinc-800 focus:text-white cursor-pointer">DRAFT</SelectItem>
                                        <SelectItem value="STARTED" className="focus:bg-indigo-900/50 focus:text-indigo-200 cursor-pointer">STARTED</SelectItem>
                                        <SelectItem value="COMPLETED" className="focus:bg-emerald-900/50 focus:text-emerald-200 cursor-pointer">COMPLETED</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                    
                </form>
            </DialogContent>
        </Dialog>
    );
}