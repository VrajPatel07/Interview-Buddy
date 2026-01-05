"use client";

import { useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
            }
            catch (err) {
                toast.error(err instanceof Error ? err.message : "Job creation failed");
            }

        });
    };


    return (
        <Card>

            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Job Details
                </CardTitle>
                <CardDescription>
                    Create job and hire candidates
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    id="job-create-form"
                    onSubmit={form.handleSubmit(submitHandler)}
                    className={cn(isPending && "opacity-70 pointer-events-none")}
                >

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

                </form>
            </CardContent>

            <CardFooter>
                <Button
                    type="submit"
                    form="job-create-form"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        "Create"
                    )}
                </Button>
            </CardFooter>

        </Card>
    );
}