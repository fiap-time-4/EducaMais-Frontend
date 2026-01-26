import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Definição das áreas restritas
const rotasProtegidas = [
  "/admin/dashboard",
  "/admin/teachers",
  "/admin/students",
  "/admin/create",
  "/admin/edit"
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 2. Verifica se o caminho atual COMEÇA com alguma das rotas da lista
  const rotaProtegida = rotasProtegidas.some((rota) => path.startsWith(rota));

  if (rotaProtegida) {
    const sessionCookie = request.cookies.get("better-auth.session_token");

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// O matcher garante que o middleware só rode nas rotas de admin para economizar processamento
export const config = {
  matcher: ["/admin/:path*"],
};