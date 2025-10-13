import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  //  Siempre dejar pasar las rutas de canchas (API)
  if (pathname.startsWith("/api/cancha")) {
    return NextResponse.next();
  }

  // En desarrollo no bloquees nada (para trabajar cómodo)
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // ---------- Producción / con login ----------
  const session = await auth();

  // Admin protegido
  if (pathname.startsWith("/admin")) {
    if (!session) return NextResponse.redirect(new URL("/", request.url));
    if (session.user?.rol === "ENTRENADOR") {
      return NextResponse.redirect(new URL("/entrenador", request.url));
    }
    if (session.user?.rol === "SOCIO") {
      return NextResponse.redirect(new URL("/socio", request.url));
    }
  }

  // Entrenador protegido
  if (pathname.startsWith("/entrenador")) {
    if (!session) return NextResponse.redirect(new URL("/", request.url));
    if (session.user?.rol === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (session.user?.rol === "SOCIO") {
      return NextResponse.redirect(new URL("/socio", request.url));
    }
  }

  // Socio protegido
  if (pathname.startsWith("/socio")) {
    if (!session) return NextResponse.redirect(new URL("/", request.url));
    if (session.user?.rol === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (session.user?.rol === "ENTRENADOR") {
      return NextResponse.redirect(new URL("/entrenador", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/entrenador/:path*", "/socio/:path*", "/api/:path*"],
};
