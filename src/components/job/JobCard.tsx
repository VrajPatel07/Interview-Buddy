"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { getRelativeTime } from "@/lib/relative-time";
import { useState, useTransition } from "react";
import UpdateJob from "./UpdateJob";
import { toast } from "sonner";
import { deleteJobAction } from "./actions";
import { Calendar, Clock, Edit, Trash2, ChevronRight } from "lucide-react";

// Helper for status colors
const getStatusColor = (status: string) => {
    switch (status) {
        case "COMPLETED": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20";
        case "STARTED": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20";
        default: return "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700";
    }
};

export default function JobCard({ job }: { job: any }) {

    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                await deleteJobAction(job.id);
                toast.success("Job deleted successfully!");
                router.refresh();
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Job deletion failed");
            }
        });
    };

    return (
        <Card className="group relative overflow-hidden bg-zinc-900/40 border-zinc-800 backdrop-blur-sm transition-all hover:bg-zinc-900/60 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10">

            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg font-semibold text-zinc-100 leading-snug truncate pr-2">
                        {job.title}
                    </CardTitle>
                    <Badge className={`border ${getStatusColor(job.status)}`}>
                        {job.status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pb-6">
                <div className="space-y-2.5">
                    <div className="flex items-center text-xs text-zinc-500">
                        <Clock className="w-3.5 h-3.5 mr-2" />
                        Created {getRelativeTime(new Date(job.createdAt))}
                    </div>
                    <div className="flex items-center text-xs text-zinc-500">
                        <Calendar className="w-3.5 h-3.5 mr-2" />
                        Updated {getRelativeTime(new Date(job.updatedAt))}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-4 border-t border-zinc-800/50 flex justify-between items-center bg-zinc-950/30">

                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(true)}
                        className="h-8 w-8 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <UpdateJob open={open} setOpen={setOpen} job={job} />

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                                className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this job?</AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-400">
                                    This action cannot be undone. This will permanently delete the job "{job.title}".
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                                    Delete Job
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <Button
                    variant="link"
                    className="text-zinc-400 hover:text-white p-0 h-auto font-normal text-xs flex items-center gap-1"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                >
                    View Details <ChevronRight className="w-3 h-3" />
                </Button>

            </CardFooter>
            
        </Card>
    );
}