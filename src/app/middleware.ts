import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Rotas que precisam de proteção
const rotasProtegidas = [
  "/admin/dashboard",
  "/admin/create",
  "/admin/edit"
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 2. Verifica se o caminho atual COMEÇA com alguma das rotas da lista
  // (Ex: /admin/edit/123 vai cair aqui porque começa com /admin/edit)
  const ehRotaProtegida = rotasProtegidas.some((rota) => path.startsWith(rota));

  if (ehRotaProtegida) {
    // Tenta pegar o cookie
    const sessionCookie = request.cookies.get("better-auth.session_token");

    // Se não tiver cookie, manda para a Home (ou login)
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};