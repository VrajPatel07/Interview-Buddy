"use client";

import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import FileUpload from "../FileUpload";
import { useRouter } from 'next/navigation';


type RecruiterProfile = {
    companyId : string;
    companyName : string;
    companyDescription? : string;
    companyWebsite? : string;
    companyLogo? : string;
};


export default function UpdateRecruiterProfile() {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [fileURL, setFileURL] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");

    const [recruiter, setRecruiter] = useState<RecruiterProfile>({
        companyId : "",
        companyName : "",
        companyDescription : "",
        companyWebsite : "",
        companyLogo : ""
    })

    const fetchRecruiterDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/api/user");
            setRecruiter(response.data.data);
            console.log(response.data);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const updateRecruiterProfile = async () => {
        setIsLoading(true);
        try {
            const updatedRecruiter = {
                ...recruiter,
                companyLogo : fileURL || recruiter.companyLogo
            };
            const response = await axios.put("/api/user", updatedRecruiter);
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
        fetchRecruiterDetails();
    }, []);


    return (
        <div>
            <form>
                <div>
                    <label htmlFor="companyName">Company Name</label>
                    <input
                        id="companyName"
                        type="text"
                        value={recruiter.companyName}
                        onChange={(e) =>
                            setRecruiter((prev) => ({ ...prev, companyName : e.target.value }))
                        }
                    />
                </div>

                <div>
                    <label htmlFor="companyDescription">Company Description</label>
                    <input
                        id="companyDescription"
                        type="text"
                        value={recruiter.companyDescription}
                        onChange={(e) =>
                            setRecruiter((prev) => ({ ...prev, companyDescription : e.target.value }))
                        }
                    />
                </div>

                <div>
                    <label htmlFor="companyWebsite">Company Website</label>
                    <input
                        id="companyWebsite"
                        type="text"
                        value={recruiter.companyWebsite}
                        onChange={(e) =>
                            setRecruiter((prev) => ({ ...prev, companyWebsite : e.target.value }))
                        }
                    />
                </div>

                <div>
                    <label htmlFor="companyLogo">Company Logo</label>

                    {(fileURL || recruiter.companyLogo) && (
                        <div>
                            <Image
                                src={fileURL || (recruiter.companyLogo as string)}
                                alt="companyLogo"
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
                        onClick={updateRecruiterProfile}
                    >
                        Save
                    </Button>
                </div>

            </form>

        </div>
    );
}
