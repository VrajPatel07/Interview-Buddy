"use client";

import * as z from "zod";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { updateJobAction } from "./actions";


const updateJobSchema = z.object({
    title: z.string().min(1, "Job title is required"),
    description: z.string().min(1, "Job description is required"),
    status: z.enum(["DRAFT", "STARTED", "COMPLETED"])
});


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
            } 
            catch (error) {
                toast.error("Failed to update job");
            }
        });
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>Update Job</DialogTitle>
                    <DialogDescription>
                        Update job details and status
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(submitHandler)}>

                    <Controller
                        name="title"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Job Title</FieldLabel>
                                <Input {...field} />
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Job Description</FieldLabel>
                                <textarea
                                    {...field}
                                    rows={4}
                                    className="w-full rounded-md border px-3 py-2 text-sm"
                                />
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="status"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Status</FieldLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRAFT">DRAFT</SelectItem>
                                        <SelectItem value="STARTED">STARTED</SelectItem>
                                        <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Job"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
                
            </DialogContent>
        </Dialog>
    );
}