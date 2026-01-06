"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, User, Edit2, ShieldCheck, Briefcase, ArrowRight, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"

type CandidateProfile = {
    name: string
    email: string
    avatar?: string | null
}

export default function CandidateProfile({ candidate }: { candidate: CandidateProfile }) {

    return (
        <Card className="w-full border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-xl overflow-hidden">
            {/* Decorative Banner */}
            <div className="h-28 bg-linear-to-r from-indigo-900/50 via-purple-900/50 to-zinc-900/50 border-b border-zinc-800"></div>

            <CardContent className="relative px-6 pb-6">
                {/* Avatar Positioning */}
                <div className="-mt-12 mb-6 flex justify-between items-end">

                    <Avatar className="w-24 h-24 border-4 border-zinc-900 shadow-lg">
                        <AvatarImage src={candidate.avatar || ""} className="object-cover" />
                        <AvatarFallback className="bg-zinc-800 text-zinc-400 text-4xl font-medium">
                            {candidate.name[0]}
                        </AvatarFallback>
                    </Avatar>

                    <div className="mb-2 hidden sm:block">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Candidate Account
                        </span>
                    </div>

                </div>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{candidate.name}</h2>
                        <p className="text-zinc-400 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-zinc-500" /> {candidate.email}
                        </p>
                    </div>

                    <div className="grid gap-4 pt-6 border-t border-zinc-800/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Static Info Card */}
                            <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50 flex flex-col justify-between h-24">
                                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider block">Role</span>
                                <span className="text-zinc-200 font-medium flex items-center gap-2 text-lg">
                                    <User className="w-5 h-5 text-indigo-400" /> Candidate
                                </span>
                            </div>

                            {/* Interactive Interviews Card */}
                            <Link href="/profile/interviews" className="block group">
                                <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all cursor-pointer h-24 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider group-hover:text-indigo-400 transition-colors">
                                            Action
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <span className="text-zinc-200 font-medium flex items-center gap-2 text-lg group-hover:text-white">
                                        <Briefcase className="w-5 h-5 text-indigo-400" />
                                        My Interviews
                                    </span>
                                </div>
                            </Link>

                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="bg-zinc-950/30 border-t border-zinc-800/50 p-6 flex items-center justify-between">

                {/* LEFT: Logout Button */}
                <Button
                    variant="outline"
                    onClick={() => signOut({ callbackUrl: "/sign-in" })}
                    className="border-red-900/30 bg-red-500/5 text-red-500 hover:bg-zinc-900 hover:text-zinc-400 hover:border-zinc-800 transition-all"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>

                {/* RIGHT: Edit Button */}
                <Button
                    asChild
                    className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
                >
                    <Link href="/profile/update">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Link>
                </Button>

            </CardFooter>

        </Card>
    )
}