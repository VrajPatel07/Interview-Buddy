import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"


export default function NotFound() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>404 - Interview Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p>We could not find the interview link you are looking for.</p>
            </CardContent>
            <CardFooter>
                <Button asChild>
                    <Link href="/profile">Go Home</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}