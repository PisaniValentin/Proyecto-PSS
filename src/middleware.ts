import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/auth";

export async function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;


  const session = await auth();


  // Bloquear /admin si no logueado o rol no ADMIN
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (session.user?.rol === "ENTRENADOR") {
      return NextResponse.redirect(new URL("/entrenador", request.url));
    } else {
      if (session.user?.rol === "SOCIO") {
        return NextResponse.redirect(new URL("/socio", request.url));
      }
    }
  }

  // Bloquear /entrenador si no logueado o rol no ENTRENADOR
  if (pathname.startsWith("/entrenador")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (session.user?.rol === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      if (session.user?.rol === "SOCIO") {
        return NextResponse.redirect(new URL("/socio", request.url));
      }
    }
  }

  if (pathname.startsWith("/socio")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (session.user?.rol === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      if (session.user?.rol === "ENTRENADOR") {
        return NextResponse.redirect(new URL("/entrenador", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/entrenador/:path*", "/socio/:path*", "/api/:path*"],
  runtime: "nodejs",
};