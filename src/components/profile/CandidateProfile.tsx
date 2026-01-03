"use client";

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


type UserProfile = {
    name: string;
    email: string;
    image?: string;
};


export default function CandidateProfile() {

    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState<UserProfile>({
        name: "",
        email: "",
        image: ""
    });

    const router = useRouter();

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/user");
            if (response.data.success) {
                const fetchedUser = response.data.data;
                setUser(fetchedUser);
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
        fetchUser();
    }, []);


    return (
        <div>
            <Button onClick={() => router.push("/profile/update")}>
                Update Profile
            </Button>

            <div>
                <p>Name : {user.name}</p>
                <p>Email : {user.email}</p>
                <p>Candidate Avatar : {user.image}</p>
            </div>

        </div>
    )
}
