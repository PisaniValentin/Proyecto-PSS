import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import { z } from 'zod';

// import bcrypt from 'bcrypt';
// import { prisma } from '@/app/lib/prisma';

async function getUser(email: string) {
//   const user = await prisma.usuario.findUnique({
//     where: { email },
//   });
//   return user
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    // Credentials({
    //   async authorize(credentials) {
    //     const parsedCredentials = z
    //       .object({
    //         email: z.string().email(),
    //         password: z.string().min(6)
    //       })
    //       .safeParse(credentials);

    //     if (parsedCredentials.success) {
    //       const { email, password } = parsedCredentials.data;
    //       // console.log('email:', email);
    //       // console.log('password:', password);
    //       const user = await getUser(email);
    //       // console.log('user es: \n', user);
    //       if (!user || !user.password) return null;

    //       // const passwordsMatch = await bcrypt.compare(password, user.password);
    //       // if (!passwordsMatch) return null;
    //       return {
    //         id: user.id.toString(),
    //         email: user.email,
    //         name: user.nombre,
    //         rol: user.rol,
    //         userId: user.id.toString(),
    //       };
    //     }
    //     return null;
    //   },
    // }),
  ],
});