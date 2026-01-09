import { DeepgramError, createClient } from "@deepgram/sdk";
import { NextResponse, type NextRequest } from "next/server";


export const revalidate = 0;


export async function GET(request: NextRequest) {

    // exit early so we don't request 70000000 keys while in devmode
    if (process.env.DEEPGRAM_ENV === "development") {
        return NextResponse.json({
            key: process.env.DEEPGRAM_API_KEY ?? "",
        });
    }

    const url = request.url;
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY ?? "");

    let { result: tokenResult, error: tokenError } = await deepgram.auth.grantToken();

    if (tokenError) {
        return NextResponse.json(tokenError);
    }

    if (!tokenResult) {
        return NextResponse.json(
            new DeepgramError(
                "Failed to generate temporary token. Make sure your API key is of scope Member or higher."
            )
        );
    }

    return NextResponse.json({
        token: tokenResult.access_token,
    }, {status : 200});

}