"use client";


import { use } from 'react';



export default function Interview({ params } : { params: Promise<{ jobKey: string }> }) {

    const { jobKey } = use(params);

    return (
        <div>page</div>
    )
}