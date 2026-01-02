import { DefaultSession, DefaultJWT } from "next-auth"

declare module "next-auth" {
    interface Session {
        user : {
            id : string;
            name : string;
            email : string;
            role : string;
            companyId : string | null;
        } & DefaultSession["user"];
    }
    interface User {
        id: string;
        name: string;
        email: string;
        role: string;
        companyId: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id : string;
        name : string;
        email : string;
        role : string;
        companyId : string | null;
    }
}