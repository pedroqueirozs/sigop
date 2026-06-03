import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/app/lib/db"

type Props = { params: Promise<{ id: string }> }

export default async function ComprovantePage({ params }: Props) {
  const { id } = await params

  const devolucao = await prisma.devolucao.findUnique({
    where: { id: Number(id) },
    include: {
      objeto:      { include: { categoria: true } },
      responsavel: { select: { nome: true } },
      beneficiario:{ select: { nome: true, email: true, matricula: true } },
    },
  })

  if (!devolucao) notFound()

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 text-center">
        <div className="text-4xl">✅</div>
        <h1 className="mt-2 text-xl font-bold text-gray-900">Devolução realizada com sucesso!</h1>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 print:shadow-none print:ring-0">
        {/* Header do comprovante */}
        <div className="bg-blue-600 px-6 py-5 text-white">
          <p className="text-xs font-medium uppercase tracking-wider opacity-75">Comprovante de Devolução</p>
          <p className="mt-1 text-lg font-bold">SIGOP</p>
          <p className="text-sm opacity-90">Sistema Integrado de Gestão de Objetos Perdidos</p>
        </div>

        {/* Dados */}
        <div className="divide-y divide-gray-100">
          <div className="px-6 py-4">
            <p className="text-xs text-gray-400">Código do comprovante</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-gray-900">{devolucao.codigoComprovante}</p>
          </div>

          <div className="px-6 py-4">
            <p className="text-xs text-gray-400">Objeto devolvido</p>
            <p className="mt-0.5 font-medium text-gray-900">{devolucao.objeto.descricao}</p>
            <p className="text-sm text-gray-500">{devolucao.objeto.categoria.nome}</p>
          </div>

          <div className="grid grid-cols-2 divide-x divide-gray-100">
            <div className="px-6 py-4">
              <p className="text-xs text-gray-400">Beneficiário</p>
              <p className="mt-0.5 font-medium text-gray-900">{devolucao.beneficiario.nome}</p>
              {devolucao.beneficiario.matricula && (
                <p className="text-xs text-gray-500">Mat. {devolucao.beneficiario.matricula}</p>
              )}
            </div>
            <div className="px-6 py-4">
              <p className="text-xs text-gray-400">Responsável pela entrega</p>
              <p className="mt-0.5 font-medium text-gray-900">{devolucao.responsavel.nome}</p>
            </div>
          </div>

          <div className="px-6 py-4">
            <p className="text-xs text-gray-400">Data e hora da devolução</p>
            <p className="mt-0.5 font-medium text-gray-900">
              {new Date(devolucao.dataDevolucao).toLocaleString("pt-BR")}
            </p>
          </div>

          {devolucao.observacoes && (
            <div className="px-6 py-4">
              <p className="text-xs text-gray-400">Observações</p>
              <p className="mt-0.5 text-sm text-gray-700">{devolucao.observacoes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => window.print()}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          🖨️ Imprimir
        </button>
        <Link
          href="/"
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Ir ao início →
        </Link>
      </div>
    </div>
  )
}
