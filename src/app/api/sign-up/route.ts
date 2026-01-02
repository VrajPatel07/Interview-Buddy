import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";


export async function POST(req: Request) {
    try {
        const { name, email, password, companyId, role  } = await req.json();

        const existingUserByEmail = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUserByEmail) {
            return Response.json({ success: false, message: "User already exists" }, { status: 400 });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role == "CANDIDATE") {
            await prisma.user.create({
                data : {
                    name,
                    email,
                    password : hashedPassword,
                    role
                }
            })
        }
        else {
            await prisma.user.create({
                data : {
                    name,
                    email,
                    password : hashedPassword,
                    companyId,
                    role
                }
            })
        }

        return Response.json({ success: true, message: "User registered successfully" }, { status: 200 });
    }
    catch (error) {
        return Response.json({ success: false, message: `Error while signup : ${error}` }, { status: 500 });
    }
}