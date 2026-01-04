import { auth } from "@/auth" // Your server-side auth helper
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import CandidateProfile from "@/components/profile/CandidateProfile"
import RecruiterProfile from "@/components/profile/RecruiterProfile"


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




export default async function ProfilePage() {
   
    const session = await auth()

    if (!session?.user?.email) {
        redirect("/sign-in");
    }

    const user = await getUserProfile(session?.user?.email, session?.user?.role);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
                User profile not found.
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden px-4 py-12">

            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size[24px_24px]"></div>
            <div className="absolute left-0 top-0 w-125 h-125 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute right-0 bottom-0 w-125 h-125 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-2xl relative z-10">
                {
                    session?.user.role === "CANDIDATE" ? (
                        <CandidateProfile candidate={user as any} />
                    ) : (
                        <RecruiterProfile recruiter={user as any} />
                    )
                }
            </div>
        </div>
    )
}