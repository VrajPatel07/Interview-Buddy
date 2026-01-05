"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getRelativeTime } from "@/lib/relative-time";
import { useState } from "react";
import UpdateJob from "./UpdateJob";



export default function JobCard({ job }: { job: any }) {

    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        await axios.delete(`/api/job/${job.id}`);
        router.refresh();
    };

    return (
        <Card>

            <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <Badge>{job.status}</Badge>
            </CardHeader>

            <CardContent>
                <p>Created {getRelativeTime(new Date(job.createdAt))}</p>
                <p>Updated {getRelativeTime(new Date(job.updatedAt))}</p>
            </CardContent>

            <CardFooter>
                <Button
                    onClick={() => setOpen(true)}
                >
                    Update
                </Button>

                <UpdateJob open={open} setOpen={setOpen} job={job} />

                <AlertDialog>

                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Delete
                        </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete this job?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                                Confirm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>

                </AlertDialog>

                <span onClick={() => router.push(`/jobs/${job.id}`)}>→</span>

            </CardFooter>

        </Card>
    );
}
