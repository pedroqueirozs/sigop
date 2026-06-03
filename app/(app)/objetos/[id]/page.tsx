import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/app/lib/db"
import { getSession } from "@/app/lib/session"
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

type Props = { params: Promise<{ id: string }> }

export default async function ObjetoDetalhe({ params }: Props) {
  const { id } = await params
  const session = await getSession()

  const objeto = await prisma.objeto.findUnique({
    where: { id: Number(id) },
    include: {
      categoria: true,
      fotos: { orderBy: { isPrincipal: "desc" } },
      registrosPerdas: {
        include: { usuario: { select: { nome: true } }, local: true },
        orderBy: { dataRegistro: "desc" },
        take: 1,
      },
      registrosEncontrados: {
        include: { usuario: { select: { nome: true } }, local: true },
        orderBy: { dataRegistro: "desc" },
        take: 1,
      },
      historicos: {
        include: { usuario: { select: { nome: true } } },
        orderBy: { dataMovimentacao: "desc" },
      },
      solicitacoes: {
        where: { idSolicitante: session?.userId },
        select: { id: true, statusSolicitacao: true },
        take: 1,
      },
    },
  })

  if (!objeto) notFound()

  const registroPerda    = objeto.registrosPerdas[0]
  const registroEnc      = objeto.registrosEncontrados[0]
  const minhaSolicitacao = objeto.solicitacoes[0]
  const podeReivindicar  =
    objeto.status === "ENCONTRADO" &&
    !minhaSolicitacao &&
    session?.userId !== registroEnc?.idUsuario

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/objetos" className="text-sm text-gray-500 hover:text-gray-900">← Objetos</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-700">Objeto #{objeto.id}</span>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[objeto.status]}`}>
                {STATUS_LABEL[objeto.status]}
              </span>
              <span className="text-xs text-gray-400">#{objeto.id}</span>
            </div>
            <h1 className="mt-2 text-lg font-bold text-gray-900 line-clamp-2">{objeto.descricao}</h1>
            <p className="mt-1 text-sm text-gray-500">{objeto.categoria.nome}</p>
          </div>
          <div className="ml-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-3xl">
            📦
          </div>
        </div>

        {/* Detalhes */}
        <div className="grid grid-cols-2 gap-px bg-gray-100">
          {objeto.marca && (
            <div className="bg-white px-6 py-4">
              <p className="text-xs text-gray-400">Marca</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{objeto.marca}</p>
            </div>
          )}
          {objeto.cor && (
            <div className="bg-white px-6 py-4">
              <p className="text-xs text-gray-400">Cor</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{objeto.cor}</p>
            </div>
          )}
          {registroPerda && (
            <div className="bg-white px-6 py-4">
              <p className="text-xs text-gray-400">Local da perda</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{registroPerda.local.nome}</p>
              <p className="text-xs text-gray-400">
                {new Date(registroPerda.dataPerda).toLocaleDateString("pt-BR")}
                {registroPerda.horaPerda && ` às ${registroPerda.horaPerda}`}
              </p>
            </div>
          )}
          {registroEnc && (
            <div className="bg-white px-6 py-4">
              <p className="text-xs text-gray-400">Local onde foi encontrado</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{registroEnc.local.nome}</p>
              <p className="text-xs text-gray-400">
                {new Date(registroEnc.dataEncontrado).toLocaleDateString("pt-BR")}
                {registroEnc.horaEncontrado && ` às ${registroEnc.horaEncontrado}`}
              </p>
            </div>
          )}
          {registroEnc?.localGuarda && (
            <div className="col-span-2 bg-white px-6 py-4">
              <p className="text-xs text-gray-400">Onde está guardado</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{registroEnc.localGuarda}</p>
            </div>
          )}
        </div>

        {/* Observações */}
        {objeto.observacoes && (
          <div className="border-t border-gray-100 px-6 py-4">
            <p className="text-xs text-gray-400">Observações</p>
            <p className="mt-1 text-sm text-gray-700">{objeto.observacoes}</p>
          </div>
        )}

        {/* Reivindicar */}
        {podeReivindicar && (
          <div className="border-t border-gray-100 bg-blue-50 px-6 py-4">
            <p className="text-sm font-medium text-blue-900">Este objeto é seu?</p>
            <p className="mt-0.5 text-xs text-blue-700">
              Apresente evidências de propriedade para solicitar a devolução.
            </p>
            <Link
              href={`/objetos/${objeto.id}/reivindicar`}
              className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Reivindicar propriedade →
            </Link>
          </div>
        )}

        {minhaSolicitacao && (
          <div className="border-t border-gray-100 bg-yellow-50 px-6 py-4">
            <p className="text-sm font-medium text-yellow-900">
              Sua solicitação está {minhaSolicitacao.statusSolicitacao === "PENDENTE" ? "em análise" : minhaSolicitacao.statusSolicitacao.toLowerCase()}.
            </p>
          </div>
        )}

        {/* Histórico */}
        <div className="border-t border-gray-100 px-6 py-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Histórico de movimentações</h2>
          <div className="flex flex-col gap-3">
            {objeto.historicos.map((h) => (
              <div key={h.id} className="flex gap-3">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                <div>
                  <p className="text-sm text-gray-800">{h.acao}</p>
                  <p className="text-xs text-gray-400">
                    {h.usuario.nome} · {new Date(h.dataMovimentacao).toLocaleString("pt-BR")}
                  </p>
                  {h.statusAnterior && (
                    <p className="text-xs text-gray-400">
                      {h.statusAnterior} → {h.statusNovo}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
