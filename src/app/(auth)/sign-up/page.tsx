"use client"

import * as React from "react"
import RecruiterSignUp from "@/components/auth/RecruiterSignUp"
import CandidateSignUp from "@/components/auth/CandidateSignUp"
import { cn } from "@/lib/utils"

export default function SignUpPage() {

    const [role, setRole] = React.useState<"CANDIDATE" | "RECRUITER">("CANDIDATE")

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden px-4 py-8">

            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
            <div className="absolute left-0 top-0 w-125 h-125 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute right-0 bottom-0 w-125 h-125 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-lg space-y-5 relative z-10">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Create an Account
                    </h2>
                    <p className="text-zinc-400 text-sm">
                        Join the AI-powered interview revolution.
                    </p>
                </div>

                {/* Role Switcher */}
                <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm">
                    {["CANDIDATE", "RECRUITER"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setRole(item as any)}
                            className={cn(
                                "relative py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                role === item
                                    ? "text-white shadow-sm bg-zinc-800"
                                    : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            {item === "CANDIDATE" ? "I'm a Candidate" : "I'm a Recruiter"}
                        </button>
                    ))}
                </div>

                {/* Form Container */}
                <div className="transition-all duration-300">
                    {role === "CANDIDATE" ? <CandidateSignUp /> : <RecruiterSignUp />}
                </div>
            </div>

        </div>
    )
}