"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateJob from "./CreateJob";

export default function CreateJobDialog() {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Job
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-lg">

                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Create New Job</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Fill in the details below to post a new opening.
                    </DialogDescription>
                </DialogHeader>

                <CreateJob onSuccess={() => setOpen(false)} />
                    
            </DialogContent>

        </Dialog>
    );
}