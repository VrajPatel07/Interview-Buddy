"use client";

import UpdateCandidateProfile from "@/components/profile/UpdateCandidateProfile";
import UpdateRecruiterProfile from "@/components/profile/UpdateRecruiterProfile";
import { useSession } from "next-auth/react";

export default function UpdateUserProfile () {

    const { data : session } = useSession();

    return (
        <div>
            {session?.user.role === "CANDIDATE" ? (
                <UpdateCandidateProfile />
            ) : (
                <UpdateRecruiterProfile />
            )}
        </div>
    );

}