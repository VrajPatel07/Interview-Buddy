"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";





export default function Jobs() {
    return (
        <div>
            <Button onClick={() => redirect("/jobs/create")}> Create Job </Button>
            <div></div>
        </div>
    )
}