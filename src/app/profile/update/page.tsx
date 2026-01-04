import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import UpdateCandidateProfile from "@/components/profile/UpdateCandidateProfile"
import UpdateRecruiterProfile from "@/components/profile/UpdateRecruiterProfile"

export default async function UpdateUserProfile() {

    const session = await auth()

    if (!session?.user?.id) return null

    if (session.user.role === "CANDIDATE") {

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { name: true, email: true, image: true }
        })

        if (!user) {
            return null;
        }

        return <UpdateCandidateProfile user={{...user, image : user.image ?? ""}} />
    }

    return <UpdateRecruiterProfile />
}
