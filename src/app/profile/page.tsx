"use client";

import CandidateProfile from "@/components/profile/CandidateProfile";
import RecruiterProfile from "@/components/profile/RecruiterProfile";
import { useSession } from "next-auth/react";

export default function UserProfile () {

    const { data : session } = useSession();

    return (
        <div>
            {session?.user.role === "CANDIDATE" ? (
                <CandidateProfile />
            ) : (
                <RecruiterProfile />
            )}
        </div>
    );

}