import Link from "next/link"
import { FileQuestion, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4">
            <Card className="w-full max-w-md bg-zinc-900/50 border-zinc-800 backdrop-blur-xl shadow-2xl">

                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-16 h-16 bg-zinc-900/80 rounded-full flex items-center justify-center mb-6 border border-zinc-800 shadow-inner">
                        <FileQuestion className="w-8 h-8 text-zinc-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Interview Not Found</CardTitle>
                    <CardDescription className="text-zinc-400 text-base mt-2">
                        We couldn't locate the interview session you are looking for.
                    </CardDescription>
                </CardHeader>

                <CardContent className="text-center pb-6">
                    <p className="text-sm text-zinc-500">
                        The link might be broken, the interview ID may be incorrect, or the session has been removed by the recruiter.
                    </p>
                </CardContent>

                <CardFooter className="flex justify-center pt-2">
                    <Button
                        asChild
                        className="bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] transition-all"
                    >
                        <Link href="/profile">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to Profile
                        </Link>
                    </Button>
                </CardFooter>

            </Card>
        </div>
    )
}