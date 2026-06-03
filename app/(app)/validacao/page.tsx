import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/app/lib/session"
import { prisma } from "@/app/lib/db"

export default async function ValidacaoPage() {
  const session = await getSession()
  if (!session?.podeValidar) redirect("/")

  const [pendentes, recentes] = await Promise.all([
    prisma.solicitacaoPosse.findMany({
      where: { statusSolicitacao: "PENDENTE" },
      include: {
        objeto:      { include: { categoria: true } },
        solicitante: { select: { nome: true, tipoUsuario: { select: { descricao: true } } } },
        evidencias:  { select: { id: true } },
      },
      orderBy: { dataSolicitacao: "asc" },
    }),
    prisma.solicitacaoPosse.findMany({
      where: { statusSolicitacao: { in: ["APROVADA", "REJEITADA"] } },
      include: {
        objeto:     { select: { descricao: true } },
        validacao:  { select: { resultado: true, dataValidacao: true } },
      },
      orderBy: { dataAtualizacao: "desc" },
      take: 10,
    }),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Painel de Validação</h1>
        <p className="mt-1 text-sm text-gray-500">Analise as solicitações de posse pendentes</p>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-gray-800">
          Pendentes{" "}
          {pendentes.length > 0 && (
            <span className="ml-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
              {pendentes.length}
            </span>
          )}
        </h2>

        {pendentes.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
            <p className="text-gray-400">Nenhuma solicitação pendente.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            {pendentes.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-gray-100" : ""}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-lg">
                    📋
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {s.objeto.descricao.slice(0, 55)}{s.objeto.descricao.length > 55 ? "…" : ""}
                    </p>
                    <p className="text-xs text-gray-400">
                      {s.solicitante.nome} · {s.solicitante.tipoUsuario.descricao} ·{" "}
                      {s.evidencias.length} evidência(s) ·{" "}
                      {new Date(s.dataSolicitacao).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/validacao/${s.id}`}
                  className="ml-4 shrink-0 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-600"
                >
                  Analisar →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {recentes.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-gray-800">Recentemente validadas</h2>
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            {recentes.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center justify-between px-5 py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}
              >
                <p className="truncate text-sm text-gray-700">
                  {s.objeto.descricao.slice(0, 55)}{s.objeto.descricao.length > 55 ? "…" : ""}
                </p>
                <div className="ml-4 flex shrink-0 items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    s.validacao?.resultado === "APROVADO"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {s.validacao?.resultado === "APROVADO" ? "Aprovada" : "Rejeitada"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {s.validacao?.dataValidacao
                      ? new Date(s.validacao.dataValidacao).toLocaleDateString("pt-BR")
                      : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
