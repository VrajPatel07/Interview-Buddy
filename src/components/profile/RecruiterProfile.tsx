"use client";

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


type RecruiterProfile = {
    companyId: string;
    companyName: string;
    companyDescription?: string;
    companyWebsite?: string;
    companyLogo?: string;
};


export default function CandidateProfile() {

    const [loading, setLoading] = useState(true);

    const [recruiter, setRecruiter] = useState<RecruiterProfile>({
        companyId: "",
        companyName: "",
        companyDescription: "",
        companyWebsite: "",
        companyLogo: ""
    });

    const router = useRouter();

    const fetchRecruiterDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/user");
            if (response.data.success) {
                const fetchedRecruiter = response.data.data;
                setRecruiter(fetchedRecruiter);
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchRecruiterDetails();
    }, []);


    return (
        <div>
            <Button onClick={() => router.push("/profile/update")}>
                Update Profile
            </Button>

            <div>
                <p>companyId : {recruiter.companyId}</p>
                <p>companyName : {recruiter.companyName}</p>
                <p>companyDescription : {recruiter.companyDescription}</p>
                <p>companyWebsite : {recruiter.companyWebsite}</p>
                 <p>Company Logo : {recruiter.companyLogo}</p>
                
            </div>

        </div>
    )
}
