import Link from "next/link"
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

const STATUS_COLOR: Record<StatusObjeto, string> = {
  PERDIDO:                  "bg-red-100 text-red-700",
  ENCONTRADO:               "bg-green-100 text-green-700",
  EM_ANALISE:               "bg-yellow-100 text-yellow-700",
  AGUARDANDO_VALIDACAO:     "bg-orange-100 text-orange-700",
  DISPONIVEL_PARA_RETIRADA: "bg-blue-100 text-blue-700",
  DEVOLVIDO:                "bg-purple-100 text-purple-700",
  ENCERRADO:                "bg-gray-100 text-gray-600",
}

type Props = { searchParams: Promise<{ status?: string; categoria?: string }> }

export default async function ObjetosPage({ searchParams }: Props) {
  const { status, categoria } = await searchParams

  const categorias = await prisma.categoriaObjeto.findMany({
    select: { id: true, nome: true },
    orderBy: { nome: "asc" },
  })

  const objetos = await prisma.objeto.findMany({
    where: {
      ...(status ? { status: status as StatusObjeto } : { status: { notIn: ["ENCERRADO"] } }),
      ...(categoria ? { idCategoria: Number(categoria) } : {}),
    },
    include: {
      categoria: { select: { nome: true } },
      registrosEncontrados: {
        include: { local: { select: { nome: true } } },
        orderBy: { dataRegistro: "desc" },
        take: 1,
      },
      registrosPerdas: {
        include: { local: { select: { nome: true } } },
        orderBy: { dataRegistro: "desc" },
        take: 1,
      },
    },
    orderBy: { dataCriacao: "desc" },
    take: 50,
  })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Objetos</h1>
          <p className="mt-1 text-sm text-gray-500">{objetos.length} registro(s) encontrado(s)</p>
        </div>
        <div className="flex gap-2">
          <Link href="/registrar/perda" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            + Registrar perda
          </Link>
          <Link href="/registrar/encontrado" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            + Objeto encontrado
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <form className="flex flex-wrap gap-3">
        <select
          name="status"
          defaultValue={status ?? ""}
          onChange={(e) => {}}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
        >
          <option value="">Todos os status</option>
          {(Object.keys(STATUS_LABEL) as StatusObjeto[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>

        <select
          name="categoria"
          defaultValue={categoria ?? ""}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Filtrar
        </button>

        {(status || categoria) && (
          <Link href="/objetos" className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:text-gray-900">
            Limpar filtros
          </Link>
        )}
      </form>

      {objetos.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-200">
          <p className="text-gray-400">Nenhum objeto encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          {objetos.map((obj, i) => {
            const local =
              obj.registrosEncontrados[0]?.local?.nome ??
              obj.registrosPerdas[0]?.local?.nome ?? "—"
            return (
              <div
                key={obj.id}
                className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-gray-100" : ""}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-lg">
                    📦
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {obj.descricao.length > 60 ? obj.descricao.slice(0, 60) + "…" : obj.descricao}
                    </p>
                    <p className="text-xs text-gray-400">
                      {obj.categoria.nome} · {local} · {obj.dataCriacao.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="ml-4 flex shrink-0 items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[obj.status]}`}>
                    {STATUS_LABEL[obj.status]}
                  </span>
                  <Link href={`/objetos/${obj.id}`} className="text-sm text-blue-600 hover:underline">
                    Ver →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
