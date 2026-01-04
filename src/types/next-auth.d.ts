import { DefaultSession, DefaultJWT } from "next-auth"

declare module "next-auth" {
    interface Session {
        user : {
            email : string;
            role : string;
        } & DefaultSession["user"];
    }
    interface User {
        email: string;
        role : string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        email : string;
        role : string
    }
}