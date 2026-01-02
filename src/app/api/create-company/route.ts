import prisma from "@/lib/prisma";


export async function POST(req: Request) {
    try {
        const { companyName, companyDescription, companyWebsite, email  } = await req.json();

        const existingCompanyByEmail = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingCompanyByEmail) {
            return Response.json({ success: false, message: "Company already exists" }, { status: 400 });
        }

        const company = await prisma.company.create({
            data : {
                name : companyName,
                description : companyDescription,
                website : companyWebsite
            }
        });

        return Response.json({ success: true, message: "User registered successfully", data : {companyId : company.id} }, { status: 200 });
    }
    catch (error) {
        return Response.json({ success: false, message: `Error while creating company : ${error}` }, { status: 500 });
    }
}