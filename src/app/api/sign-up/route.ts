import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";


export async function POST(req: Request) {
    try {
        const { name, email, password, description, website, role } = await req.json();

        if (role == "CANDIDATE") {

            const existingCandidateByEmail = await prisma.candidate.findUnique({
                where: {
                    email: email
                }
            });

            if (existingCandidateByEmail) {
                return Response.json({ success: false, message: "User already exists" }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.candidate.create({
                data: {
                    name,
                    email,
                    password: hashedPassword
                }
            });
            
        }
        else {
            
            const existingCompanyByEmail = await prisma.company.findUnique({
                where: {
                    email: email
                }
            });

            if (existingCompanyByEmail) {
                return Response.json({ success: false, message: "User already exists" }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.company.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    description,
                    website
                }
            });

        }

        return Response.json({ success: true, message: "User registered successfully" }, { status: 200 });

    }
    catch (error) {
        return Response.json({ success: false, message: `Error while signup : ${error}` }, { status: 500 });
    }
}