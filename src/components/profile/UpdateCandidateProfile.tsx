"use client";

import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import FileUpload from "../FileUpload";
import { useRouter } from 'next/navigation';


type CandidateProfile = {
    name: string;
    email: string;
    image?: string;
};

export default function UpdateCandidateProfile() {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [fileURL, setFileURL] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");

    const [candidate, setCandidate] = useState<CandidateProfile>({
        name : "",
        email : "",
        image : ""
    })

    const fetchCandidateDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/api/user");
            setCandidate(response.data.data);
            console.log(response.data);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const updateCandidateProfile = async () => {
        setIsLoading(true);
        try {
            const updatedCandidate = {
                ...candidate,
                image: fileURL || candidate.image,
            };
            const response = await axios.put("/api/user", updatedCandidate);
            if (response.data.success) {
                router.back();
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCandidateDetails();
    }, []);


    return (
        <div>
            <form>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        value={candidate.name}
                        onChange={(e) =>
                            setCandidate((prev) => ({ ...prev, name: e.target.value }))
                        }
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={candidate.email}
                        onChange={(e) =>
                            setCandidate((prev) => ({ ...prev, email: e.target.value }))
                        }
                    />
                </div>

                <div>
                    <label htmlFor="profile-image">Candidate Avatar</label>

                    {(fileURL || candidate.image) && (
                        <div>
                            <Image
                                src={fileURL || (candidate.image as string)}
                                alt="Profile Image"
                                width={120}
                                height={120}
                            />
                        </div>
                    )}

                    <FileUpload fileType="IMAGE" setFileURL={setFileURL} />
                </div>

                <div>
                    <Button
                        type="button"
                        onClick={updateCandidateProfile}
                    >
                        Save
                    </Button>
                </div>

            </form>

        </div>
    );
}
