import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import UpdateCandidateProfile from "@/components/profile/UpdateCandidateProfile"
import UpdateRecruiterProfile from "@/components/profile/UpdateRecruiterProfile"
import { redirect } from "next/navigation"

async function getUserProfile(email: string, role: string) {
    if (role === "CANDIDATE") {
        return await prisma.candidate.findUnique({
            where: { email },
            select: { name: true, email: true, avatar: true }
        })
    }
    else {
        return await prisma.company.findUnique({
            where: { email },
            select: { name: true, email: true, website: true, logo: true, description: true }
        })
    }
}

export default async function UpdateUserProfile() {

    const session = await auth()

    if (!session?.user?.email) {
        redirect("/sign-in");
    }

    const user = await getUserProfile(session?.user?.email, (session.user as any).role);

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
                User profile not found.
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative px-4 py-12">

            <div className="fixed inset-0 w-full h-full pointer-events-none">
                <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size[24px_24px]"></div>
                <div className="absolute left-0 top-0 w-125 h-125 bg-indigo-500/10 blur-[100px] rounded-full" />
                <div className="absolute right-0 bottom-0 w-125 h-125 bg-violet-500/10 blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-lg relative z-10">
                {
                    (session.user as any).role === "CANDIDATE" ? (
                        <UpdateCandidateProfile candidate={user as any} />
                    ) : (
                        <UpdateRecruiterProfile recruiter={user as any} />
                    )
                }
            </div>
        </div>
    )
}