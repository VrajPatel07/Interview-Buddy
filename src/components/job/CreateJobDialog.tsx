"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateJob from "./CreateJob";

export default function CreateJobDialog() {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>
                <Button>Create Job</Button>
            </DialogTrigger>

            <DialogContent>
                
                <DialogHeader>
                    <DialogTitle>Create Job</DialogTitle>
                    <DialogDescription>
                        Create a new job and start hiring
                    </DialogDescription>
                </DialogHeader>

                <CreateJob onSuccess={() => setOpen(false)} />

            </DialogContent>

        </Dialog>
    );
}
