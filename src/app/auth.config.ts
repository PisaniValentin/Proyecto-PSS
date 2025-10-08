import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/?error=Unauthorized',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const isLoggedIn = !!auth?.user;

      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      const isClientProtectedRoute = ['/cart','/profile'].some(path =>
        nextUrl.pathname.startsWith(path)
      );

      if (isOnAdmin) {
        return isLoggedIn && user?.rol === 'ADMIN';
      }

      if (isClientProtectedRoute) {
        return (isLoggedIn && user?.rol === 'ENTRENADOR');
      }

      return true;
    },

    jwt({ token, user }) {
      if (user) {
        token.rol = user.rol
        token.id = user.id?.toString();
      }
      return token
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
        id: (token.id ?? token.sub) as string,
        rol: token.rol,
      };
      return session;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [],
} satisfies NextAuthConfig;