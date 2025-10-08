import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Rol } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            rol: Rol;
            dni: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        rol: Rol;
        dni: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        rol: Rol;
        dni: string;
    }
}