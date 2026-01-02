"use client";

import React, { useEffect } from 'react';
import { useSession } from "next-auth/react";

import FileUpload from '../FileUpload';


export default function UserProfile () {

    const { data : session } = useSession();

    return (
        <div>
            <FileUpload fileType={"IMAGE"} />
        </div>
    )
}
