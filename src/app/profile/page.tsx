import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import CandidateProfile from "@/components/profile/CandidateProfile"
import RecruiterProfile from "@/components/profile/RecruiterProfile"
import { redirect } from "next/navigation"

export default async function UserProfile() {

    const session = await auth()

    if (!session?.user?.id) return redirect("/sign-in")

    let userComponent = null

    if (session.user.role === "CANDIDATE") {

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { name: true, email: true, image: true }
        })

        if (user) {
            userComponent = <CandidateProfile user={user} />
        }
    } 
    else {
        // Assuming RecruiterProfile handles its own fetching or is static for now
        userComponent = <RecruiterProfile />
    }

    if (!userComponent) return null

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden px-4 py-12">
            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-position-[24px_24px]"></div>
            <div className="absolute left-0 top-0 w-125 h-125 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute right-0 bottom-0 w-125 h-125 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-2xl relative z-10">
                {userComponent}
            </div>
        </div>
    )
}