import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {

    const session = await auth();
    const { pathname } = request.nextUrl;

    if (session && (pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/")) {
        return NextResponse.redirect(new URL("/profile", request.url));
    }

    if (!session && pathname !== "/sign-in" && pathname !== "/sign-up") {
        const loginUrl = new URL("/sign-in", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};