import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/app/lib/session"

const publicRoutes = ["/login", "/cadastro"]

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublic = publicRoutes.includes(path)

  const token = request.cookies.get("session")?.value
  const session = await decrypt(token)

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }

  if (session && isPublic) {
    return NextResponse.redirect(new URL("/", request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}
