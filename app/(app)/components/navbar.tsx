"use client"
import { useActionState } from "react"
import Link from "next/link"
import { logout } from "@/app/actions/auth"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/",          label: "Dashboard" },
  { href: "/objetos",   label: "Objetos"   },
  { href: "/registrar", label: "Registrar" },
]

type Props = {
  userName: string
  podeValidar: boolean
  notificacoesNaoLidas: number
}

export default function Navbar({ userName, podeValidar, notificacoesNaoLidas }: Props) {
  const pathname = usePathname()
  const [, action] = useActionState(logout, undefined)

  const links = podeValidar
    ? [...navLinks, { href: "/validacao", label: "Validação" }]
    : navLinks

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
            <span className="text-xl">🎒</span>
            <span>SIGOP</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/notificacoes"
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notificacoesNaoLidas > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {notificacoesNaoLidas > 9 ? "9+" : notificacoesNaoLidas}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2 rounded-lg px-2 py-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden text-sm font-medium text-gray-700 md:block">
              {userName.split(" ")[0]}
            </span>
          </div>

          <form action={action}>
            <button
              type="submit"
              className="rounded-md px-3 py-1.5 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
