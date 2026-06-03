import { notFound, redirect } from "next/navigation"
import { getSession } from "@/app/lib/session"
import { prisma } from "@/app/lib/db"
import DevolucaoForm from "./devolucao-form"

type Props = { params: Promise<{ id: string }> }

export default async function DevolucaoPage({ params }: Props) {
  const { id } = await params
  const session = await getSession()
  if (!session?.podeValidar) redirect("/")

  const solicitacao = await prisma.solicitacaoPosse.findUnique({
    where: { id: Number(id) },
    include: {
      objeto:      { include: { categoria: true } },
      solicitante: { select: { nome: true, email: true } },
      devolucao:   true,
    },
  })

  if (!solicitacao || solicitacao.statusSolicitacao !== "APROVADA") notFound()

  if (solicitacao.devolucao) {
    redirect(`/comprovante/${solicitacao.devolucao.id}`)
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Registrar devolução</h1>
        <p className="mt-1 text-sm text-gray-500">Solicitação #{solicitacao.id} — aprovada</p>
      </div>

      <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-100 px-6 py-4">
          <p className="text-xs text-gray-400">Objeto</p>
          <p className="mt-0.5 font-medium text-gray-900">{solicitacao.objeto.descricao}</p>
          <p className="text-sm text-gray-500">{solicitacao.objeto.categoria.nome}</p>
        </div>
        <div className="px-6 py-4">
          <p className="text-xs text-gray-400">Beneficiário</p>
          <p className="mt-0.5 font-medium text-gray-900">{solicitacao.solicitante.nome}</p>
          <p className="text-sm text-gray-500">{solicitacao.solicitante.email}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <DevolucaoForm idSolicitacao={solicitacao.id} />
      </div>
    </div>
  )
}
