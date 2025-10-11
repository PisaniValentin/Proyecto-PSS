import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/auth";

export async function middleware(request: NextRequest) {
  // const publicApiRoutes = [
  //   { path: "/api/mercadoPago/webhook", method: "ANY" },
  //   { path: "/api/productos", method: "GET" },
  //   { path: "/api/productoOferta", method: "GET" },
  //   { path: "/api/compras", method: "GET" },
  //   { path: "/api/carrito", method: "GET" },
  //   { path: "/api/compras", method: "POST" }, // para crear compra
  //   { path: "/api/compras", method: "PUT" }, // para actualizar compra
  //   { path: "/api/carrito", method: "DELETE" }, // para limpiar carrito
  //   { path: "/api/usuario", method: "POST" }, // solo registrar
  // ];

  const { pathname } = request.nextUrl;

  // if (
  //   publicApiRoutes.some(
  //     (route) =>
  //       pathname.startsWith(route.path) &&
  //       (route.method === "ANY" || request.method === route.method)
  //   )
  // ) {
  //   return NextResponse.next();
  // }

  const session = await auth();

  if (session) {
    if (session.user?.rol === "ADMIN") {
      if (pathname.startsWith("/entrenador")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }
  }

  // // ✅ Aplicar el middleware a las demás rutas API
  // if (
  //   pathname.startsWith("/api/") &&
  //   !pathname.startsWith("/api/auth") &&
  //   !session
  // ) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // Bloquear /admin si no logueado o rol no ADMIN
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (session.user?.rol === "ENTRENADOR") {
      return NextResponse.redirect(new URL("/entrenador", request.url));
    }else{
      if (session.user?.rol === "SOCIO") {
        return NextResponse.redirect(new URL("/socio", request.url));
      }
  }}

  // Bloquear /entrenador si no logueado o rol no ENTRENADOR
  if (pathname.startsWith("/entrenador")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (session.user?.rol === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }else{
      if (session.user?.rol === "SOCIO") {
        return NextResponse.redirect(new URL("/socio", request.url));
      }
  }}

  // // Bloquear /cart si no logueado o rol no CLIENTE
  // if (pathname.startsWith("/cart")) {
  //   if (!session) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  //   if (session.user?.rol !== "ENTRENADOR") {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*","/entrenador/:path*","/socio/:path*", "/api/:path*"],
};