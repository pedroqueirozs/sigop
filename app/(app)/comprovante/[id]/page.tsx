import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/app/lib/db"
import PrintButton from "./print-button"

type Props = { params: Promise<{ id: string }> }

function mascaraCpf(cpf: string) {
  return `***.***.${cpf.slice(6, 9)}-**`
}

export default async function ComprovantePage({ params }: Props) {
  const { id } = await params

  const devolucao = await prisma.devolucao.findUnique({
    where: { id: Number(id) },
    include: {
      objeto: {
        include: {
          categoria: true,
          fotos: { where: { isPrincipal: true }, take: 1 },
          registrosEncontrados: { include: { local: true }, take: 1, orderBy: { dataRegistro: "desc" } },
        },
      },
      responsavel:  { select: { nome: true } },
      beneficiario: { select: { nome: true, cpf: true, matricula: true, tipoUsuario: { select: { descricao: true } } } },
    },
  })

  if (!devolucao) notFound()

  const foto       = devolucao.objeto.fotos[0]
  const localEnc   = devolucao.objeto.registrosEncontrados[0]?.local?.nome ?? "—"
  const dataFormatada = new Date(devolucao.dataDevolucao).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })

  return (
    <div className="mx-auto max-w-xl">
      {/* Botões — não aparecem na impressão */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">← Início</Link>
        <div className="flex gap-3">
          <PrintButton />
          <Link
            href="/validacao"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Nova validação
          </Link>
        </div>
      </div>

      {/* ─── RECIBO ─── */}
      <div
        id="recibo"
        className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 print:rounded-none print:shadow-none print:ring-0"
      >
        {/* Cabeçalho */}
        <div className="bg-blue-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-75">
                Achados e Perdidos
              </p>
              <p className="mt-0.5 text-xl font-bold">Recibo de Retirada</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-75">Código</p>
              <p className="font-mono text-sm font-bold">{devolucao.codigoComprovante}</p>
            </div>
          </div>
        </div>

        {/* Objeto + foto */}
        <div className="flex items-start gap-4 border-b border-gray-100 px-6 py-5">
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={foto.urlFoto}
              alt="Foto do objeto"
              className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-gray-200"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-3xl">
              📦
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Objeto</p>
            <p className="mt-0.5 font-semibold text-gray-900">{devolucao.objeto.descricao}</p>
            <p className="mt-0.5 text-sm text-gray-500">{devolucao.objeto.categoria.nome}</p>
            <p className="mt-0.5 text-xs text-gray-400">Encontrado em: {localEnc}</p>
          </div>
        </div>

        {/* Dados do solicitante */}
        <div className="border-b border-gray-100 px-6 py-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Solicitante
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400">Nome</p>
              <p className="font-medium text-gray-900">{devolucao.beneficiario.nome}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Tipo</p>
              <p className="font-medium text-gray-900">{devolucao.beneficiario.tipoUsuario.descricao}</p>
            </div>
            {devolucao.beneficiario.matricula && (
              <div>
                <p className="text-xs text-gray-400">Matrícula / SIAPE</p>
                <p className="font-medium text-gray-900">{devolucao.beneficiario.matricula}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400">CPF</p>
              <p className="font-medium text-gray-900">{mascaraCpf(devolucao.beneficiario.cpf)}</p>
            </div>
          </div>
        </div>

        {/* Dados da retirada */}
        <div className="border-b border-gray-100 px-6 py-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Retirada
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400">Data e hora</p>
              <p className="font-medium text-gray-900">{dataFormatada}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Responsável pela entrega</p>
              <p className="font-medium text-gray-900">{devolucao.responsavel.nome}</p>
            </div>
          </div>
          {devolucao.observacoes && (
            <div className="mt-3">
              <p className="text-xs text-gray-400">Observações</p>
              <p className="mt-0.5 text-sm text-gray-700">{devolucao.observacoes}</p>
            </div>
          )}
        </div>

        {/* Assinatura */}
        <div className="px-6 py-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Assinatura do solicitante
          </p>
          <p className="mb-8 text-xs text-gray-400">
            Declaro que recebi o objeto acima descrito em perfeito estado.
          </p>

          {/* Linha de assinatura */}
          <div className="mt-2 border-t-2 border-gray-900 pt-2">
            <p className="text-xs text-gray-500">
              {devolucao.beneficiario.nome}
              {devolucao.beneficiario.matricula ? ` — Mat. ${devolucao.beneficiario.matricula}` : ""}
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-300">
            SIGOP · {dataFormatada} · {devolucao.codigoComprovante}
          </p>
        </div>
      </div>

      {/* Mensagem de sucesso — não aparece na impressão */}
      <p className="mt-4 text-center text-sm text-gray-500 print:hidden">
        Imprima este recibo, solicite a assinatura e arquive uma via.
      </p>
    </div>
  )
}
