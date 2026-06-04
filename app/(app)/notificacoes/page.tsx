import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/app/lib/session"
import { prisma } from "@/app/lib/db"
import { marcarTodasLidas } from "@/app/actions/notificacao"

export default async function NotificacoesPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const notificacoes = await prisma.notificacao.findMany({
    where: { idUsuarioDestino: session.userId },
    include: { objeto: { select: { id: true, descricao: true } } },
    orderBy: { dataCriacao: "desc" },
    take: 50,
  })

  const naoLidas = notificacoes.filter((n) => !n.lida).length

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notificações</h1>
          <p className="mt-1 text-sm text-gray-500">
            {naoLidas > 0 ? `${naoLidas} não lida(s)` : "Tudo em dia"}
          </p>
        </div>

        {naoLidas > 0 && (
          <form action={marcarTodasLidas}>
            <button
              type="submit"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Marcar todas como lidas
            </button>
          </form>
        )}
      </div>

      {notificacoes.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-200">
          <p className="text-3xl">🔔</p>
          <p className="mt-2 text-gray-400">Nenhuma notificação ainda.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          {notificacoes.map((n, i) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 px-5 py-4 ${i > 0 ? "border-t border-gray-100" : ""} ${
                !n.lida ? "bg-blue-50/40" : ""
              }`}
            >
              <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${!n.lida ? "bg-blue-500" : "bg-transparent"}`} />

              <div className="min-w-0 flex-1">
                <p className={`text-sm ${!n.lida ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                  {n.mensagem}
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(n.dataCriacao).toLocaleString("pt-BR")}
                  </span>
                  {n.objeto && (
                    <Link
                      href={`/objetos/${n.objeto.id}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Ver objeto →
                    </Link>
                  )}
                </div>
              </div>

              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                {n.tipoNotificacao}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
