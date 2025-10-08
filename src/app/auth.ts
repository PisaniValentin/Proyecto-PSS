import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/app/auth.config";
import { z } from "zod";

// import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

async function getUser(dni: string) {
  const user = await prisma.usuario.findUnique({
    where: { dni },
  });
  return user;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            dni: z.string(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { dni, password } = parsedCredentials.data;
          const user = await getUser(dni);
          if (!user || !user.password) return null;

          if(password !== user.password) return null
          // Descomentar para utilizar las claves encriptadas en produccion.
          // const passwordsMatch = await bcrypt.compare(password, user.password);
          // if (!passwordsMatch) return null;
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.nombre,
            rol: user.rol,
            userId: user.id.toString(),
          };
        }
        return null;
      },
    }),
  ],
});