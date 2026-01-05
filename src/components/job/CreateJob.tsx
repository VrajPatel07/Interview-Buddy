"use client";

import { useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { createJobSchema } from "@/schemas/job-schema";
import { createJobAction } from "./actions";

export default function CreateJob({ onSuccess }: { onSuccess?: () => void }) {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof createJobSchema>>({
        resolver: zodResolver(createJobSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const submitHandler = (data: z.infer<typeof createJobSchema>) => {
        startTransition(async () => {
            try {
                await createJobAction(data);
                toast.success("Job created successfully!");
                form.reset();
                onSuccess?.();
                router.refresh();
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Job creation failed");
            }
        });
    };

    return (
        <form
            id="job-create-form"
            onSubmit={form.handleSubmit(submitHandler)}
            className={cn("space-y-5 mt-4", isPending && "opacity-70 pointer-events-none")}
        >
            
            <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-zinc-300 font-medium">Job Title</FieldLabel>
                        <Input
                            {...field}
                            placeholder="e.g. Senior Frontend Engineer"
                            className="bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 text-zinc-100 placeholder:text-zinc-600"
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
                        <FieldLabel className="text-zinc-300 font-medium">Job Description</FieldLabel>
                        <textarea
                            {...field}
                            rows={5}
                            placeholder="Describe the role, responsibilities, and requirements..."
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <div className="flex justify-end pt-2">
                <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white w-full sm:w-auto"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        "Create Job Posting"
                    )}
                </Button>
            </div>

        </form>
    );
}