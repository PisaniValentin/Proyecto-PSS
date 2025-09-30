import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
//   secret: process.env.AUTH_SECRET,
//   pages: {
//     signIn: '/login',
//     signOut: '/login',
//     error: '/login?error=Unauthorized',
//   },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const user = auth?.user;
//       const isLoggedIn = !!auth?.user;

//       const isOnAdmin = nextUrl.pathname.startsWith('/admin');
//       const isClientProtectedRoute = ['/checkout', '/cart'].some(path =>
//         nextUrl.pathname.startsWith(path)
//       );

//       if (isOnAdmin) {
//         if (isLoggedIn && user?.rol === 'ADMIN') return true
//         return Response.redirect(new URL('/', nextUrl));
//       }

//       if (isClientProtectedRoute) {
//         if (isLoggedIn && user?.rol === 'CLIENTE') return true;
//         return Response.redirect(new URL('/', nextUrl));
//       }

//       return true;
//     },

//     jwt({ token, user }) {
//       if (user) {
//         token.rol = user.rol
//         token.id = user.id?.toString();
//       }
//       console.log('JWT token:', token);
//       return token
//     },
//     session({ session, token }) {
//       session.user = {
//         ...session.user,
//         id: (token.id ?? token.sub) as string,
//         rol: token.rol,
//       };
//       console.log('Session user:', session.user);
//       return session;
//     },
//   },

//   session: {
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60,
//   },
  providers: [],
} satisfies NextAuthConfig;