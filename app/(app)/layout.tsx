import { redirect } from "next/navigation"
import { getSession } from "@/app/lib/session"
import { prisma } from "@/app/lib/db"
import Navbar from "./components/navbar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/login")

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.userId },
    select: { nome: true },
  })

  const notificacoesNaoLidas = await prisma.notificacao.count({
    where: { idUsuarioDestino: session.userId, lida: false },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName={usuario?.nome ?? "Usuário"}
        podeValidar={session.podeValidar}
        notificacoesNaoLidas={notificacoesNaoLidas}
      />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}
