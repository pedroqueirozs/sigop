import Link from "next/link"
import { getSession } from "@/app/lib/session"
import { prisma } from "@/app/lib/db"
import { StatusObjeto } from "@/app/generated/prisma/client"

const STATUS_LABEL: Record<StatusObjeto, string> = {
  PERDIDO:                  "Perdido",
  ENCONTRADO:               "Encontrado",
  EM_ANALISE:               "Em Análise",
  AGUARDANDO_VALIDACAO:     "Aguardando Validação",
  DISPONIVEL_PARA_RETIRADA: "Disponível para Retirada",
  DEVOLVIDO:                "Devolvido",
  ENCERRADO:                "Encerrado",
}

const STATUS_COLOR: Partial<Record<StatusObjeto, string>> = {
  PERDIDO:                  "bg-red-100 text-red-700",
  ENCONTRADO:               "bg-green-100 text-green-700",
  EM_ANALISE:               "bg-yellow-100 text-yellow-700",
  AGUARDANDO_VALIDACAO:     "bg-orange-100 text-orange-700",
  DISPONIVEL_PARA_RETIRADA: "bg-blue-100 text-blue-700",
}

export default async function DashboardPage() {
  const session = await getSession()

  const inicioMes = new Date()
  inicioMes.setDate(1)
  inicioMes.setHours(0, 0, 0, 0)

  const [totalEncontrados, aguardandoValidacao, devolvidosMes, recentes] = await Promise.all([
    prisma.objeto.count({ where: { status: "ENCONTRADO" } }),
    prisma.objeto.count({ where: { status: { in: ["EM_ANALISE", "AGUARDANDO_VALIDACAO", "DISPONIVEL_PARA_RETIRADA"] } } }),
    prisma.objeto.count({ where: { status: "ENCERRADO", dataAtualizacao: { gte: inicioMes } } }),
    prisma.objeto.findMany({
      where: { status: { notIn: ["ENCERRADO"] } },
      include: {
        categoria: { select: { nome: true } },
        registrosEncontrados: { include: { local: { select: { nome: true } } }, take: 1, orderBy: { dataRegistro: "desc" } },
        fotos: { where: { isPrincipal: true }, take: 1 },
      },
      orderBy: { dataCriacao: "desc" },
      take: 6,
    }),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Visão geral dos objetos registrados</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <p className="text-sm text-gray-500">Objetos encontrados</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{totalEncontrados}</p>
          <p className="mt-1 text-xs text-gray-400">aguardando dono</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <p className="text-sm text-gray-500">Em análise</p>
          <p className="mt-1 text-3xl font-bold text-yellow-600">{aguardandoValidacao}</p>
          <p className="mt-1 text-xs text-gray-400">solicitações pendentes</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <p className="text-sm text-gray-500">Devolvidos este mês</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{devolvidosMes}</p>
          <p className="mt-1 text-xs text-gray-400">casos encerrados</p>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/registrar/perda"
          className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition hover:ring-blue-400"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-xl">
            📋
          </div>
          <div>
            <p className="font-semibold text-gray-900">Registrar perda</p>
            <p className="text-xs text-gray-500">Perdi um objeto no campus</p>
          </div>
        </Link>
        <Link
          href="/registrar/encontrado"
          className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition hover:ring-blue-400"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-xl">
            📦
          </div>
          <div>
            <p className="font-semibold text-gray-900">Registrar encontrado</p>
            <p className="text-xs text-gray-500">Encontrei um objeto no campus</p>
          </div>
        </Link>
      </div>

      {/* Objetos recentes */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Objetos recentes</h2>
          <Link href="/objetos" className="text-sm text-blue-600 hover:underline">
            Ver todos →
          </Link>
        </div>

        {recentes.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
            <p className="text-gray-400">Nenhum objeto registrado ainda.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            {recentes.map((obj, i) => {
              const local = obj.registrosEncontrados[0]?.local?.nome ?? "—"
              const data = obj.dataCriacao.toLocaleDateString("pt-BR")
              const cor = STATUS_COLOR[obj.status] ?? "bg-gray-100 text-gray-600"
              return (
                <div
                  key={obj.id}
                  className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-gray-100" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
                      📦
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {obj.descricao.length > 50 ? obj.descricao.slice(0, 50) + "…" : obj.descricao}
                      </p>
                      <p className="text-xs text-gray-400">
                        {obj.categoria.nome} · {local} · {data}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cor}`}>
                      {STATUS_LABEL[obj.status]}
                    </span>
                    <Link
                      href={`/objetos/${obj.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Ver →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
