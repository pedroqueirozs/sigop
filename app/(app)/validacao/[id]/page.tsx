import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/app/lib/session"
import { prisma } from "@/app/lib/db"
import ValidacaoForm from "./validacao-form"

type Props = { params: Promise<{ id: string }> }

export default async function ValidacaoDetalhePage({ params }: Props) {
  const { id } = await params
  const session = await getSession()
  if (!session?.podeValidar) redirect("/")

  const solicitacao = await prisma.solicitacaoPosse.findUnique({
    where: { id: Number(id) },
    include: {
      objeto: {
        include: {
          categoria: true,
          fotos: { take: 3 },
          registrosEncontrados: { include: { local: true }, take: 1 },
        },
      },
      solicitante: {
        include: { tipoUsuario: { select: { descricao: true } } },
      },
      evidencias: true,
      validacao:  true,
    },
  })

  if (!solicitacao) notFound()

  const jaProcessada = solicitacao.statusSolicitacao !== "PENDENTE"
  const enc = solicitacao.objeto.registrosEncontrados[0]

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/validacao" className="text-sm text-gray-500 hover:text-gray-900">← Validação</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-700">Solicitação #{solicitacao.id}</span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Objeto */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-4 font-semibold text-gray-800">Objeto reivindicado</h2>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
              📦
            </div>
            <div>
              <p className="font-medium text-gray-900">{solicitacao.objeto.descricao}</p>
              <p className="mt-0.5 text-sm text-gray-500">{solicitacao.objeto.categoria.nome}</p>
              {solicitacao.objeto.marca && <p className="text-sm text-gray-500">Marca: {solicitacao.objeto.marca}</p>}
              {solicitacao.objeto.cor && <p className="text-sm text-gray-500">Cor: {solicitacao.objeto.cor}</p>}
              {enc && (
                <p className="mt-1 text-sm text-gray-400">
                  Encontrado em: {enc.local.nome} ·{" "}
                  {new Date(enc.dataEncontrado).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
          </div>
          <Link
            href={`/objetos/${solicitacao.objeto.id}`}
            className="mt-3 inline-block text-sm text-blue-600 hover:underline"
          >
            Ver detalhe completo →
          </Link>
        </div>

        {/* Solicitante */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-4 font-semibold text-gray-800">Solicitante</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400">Nome</p>
              <p className="font-medium text-gray-900">{solicitacao.solicitante.nome}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Tipo</p>
              <p className="font-medium text-gray-900">{solicitacao.solicitante.tipoUsuario.descricao}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">E-mail</p>
              <p className="font-medium text-gray-900">{solicitacao.solicitante.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Solicitado em</p>
              <p className="font-medium text-gray-900">
                {new Date(solicitacao.dataSolicitacao).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </div>

        {/* Reivindicação */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-3 font-semibold text-gray-800">Justificativa do solicitante</h2>
          <p className="text-sm text-gray-700">{solicitacao.descricaoReivindicacao}</p>
        </div>

        {/* Evidências */}
        {solicitacao.evidencias.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-3 font-semibold text-gray-800">Evidências</h2>
            {solicitacao.evidencias.map((ev) => (
              <div key={ev.id} className="rounded-lg bg-gray-50 p-3 text-sm">
                <p className="font-medium text-gray-700">{ev.tipoEvidencia}</p>
                {ev.descricao && <p className="mt-1 text-gray-600">{ev.descricao}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Decisão */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-4 font-semibold text-gray-800">Sua decisão</h2>
          {jaProcessada ? (
            <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
              solicitacao.statusSolicitacao === "APROVADA"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}>
              Esta solicitação já foi{" "}
              {solicitacao.statusSolicitacao === "APROVADA" ? "aprovada" : "rejeitada"}.
              {solicitacao.validacao?.justificativa && (
                <p className="mt-1 font-normal">{solicitacao.validacao.justificativa}</p>
              )}
            </div>
          ) : (
            <ValidacaoForm idSolicitacao={solicitacao.id} />
          )}
        </div>
      </div>
    </div>
  )
}
