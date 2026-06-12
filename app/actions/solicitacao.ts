"use server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/app/lib/db"
import { getSession } from "@/app/lib/session"

// ─── Solicitação de posse ────────────────────────────────────────────────────

const SolicitacaoSchema = z.object({
  idObjeto:               z.coerce.number().min(1),
  descricaoReivindicacao: z.string().min(10, { message: "Descreva com pelo menos 10 caracteres" }).trim(),
  tipoEvidencia:          z.string().trim().optional(),
  descricaoEvidencia:     z.string().trim().optional(),
})

export type SolicitacaoState = {
  errors?: { descricaoReivindicacao?: string[]; descricaoEvidencia?: string[] }
  message?: string
} | undefined

export async function solicitarPosse(
  state: SolicitacaoState,
  formData: FormData
): Promise<SolicitacaoState> {
  const session = await getSession()
  if (!session) redirect("/login")

  const validated = SolicitacaoSchema.safeParse({
    idObjeto:               formData.get("idObjeto"),
    descricaoReivindicacao: formData.get("descricaoReivindicacao"),
    tipoEvidencia:          formData.get("tipoEvidencia") || undefined,
    descricaoEvidencia:     formData.get("descricaoEvidencia") || undefined,
  })

  if (!validated.success) {
    const fieldErrors = validated.error.flatten().fieldErrors
    return {
      errors: {
        descricaoReivindicacao: fieldErrors.descricaoReivindicacao,
        descricaoEvidencia:     fieldErrors.descricaoEvidencia,
      },
    }
  }

  const { idObjeto, descricaoReivindicacao, tipoEvidencia, descricaoEvidencia } = validated.data

  const objeto = await prisma.objeto.findUnique({ where: { id: idObjeto } })
  if (!objeto || objeto.status !== "ENCONTRADO") {
    return { message: "Este objeto não está disponível para reivindicação." }
  }

  const jaExiste = await prisma.solicitacaoPosse.findFirst({
    where: { idObjeto, idSolicitante: session.userId, statusSolicitacao: "PENDENTE" },
  })
  if (jaExiste) {
    return { message: "Você já possui uma solicitação pendente para este objeto." }
  }

  const solicitacao = await prisma.solicitacaoPosse.create({
    data: { idObjeto, idSolicitante: session.userId, descricaoReivindicacao },
  })

  if (tipoEvidencia || descricaoEvidencia) {
    await prisma.evidencia.create({
      data: {
        idSolicitacao:  solicitacao.id,
        tipoEvidencia:  tipoEvidencia ?? "Descrição",
        descricao:      descricaoEvidencia ?? null,
      },
    })
  }

  await prisma.objeto.update({
    where: { id: idObjeto },
    data: { status: "EM_ANALISE" },
  })

  await prisma.historicoMovimentacao.create({
    data: {
      idObjeto,
      idUsuario:      session.userId,
      statusAnterior: "ENCONTRADO",
      statusNovo:     "EM_ANALISE",
      acao:           "Solicitação de posse registrada",
    },
  })

  redirect(`/objetos/${idObjeto}`)
}

// ─── Validação ───────────────────────────────────────────────────────────────

const ValidacaoSchema = z.object({
  idSolicitacao: z.coerce.number().min(1),
  resultado:     z.enum(["APROVADO", "REJEITADO"]),
  justificativa: z.string().trim().optional(),
})

export type ValidacaoState =
  | { errors?: { justificativa?: string[] }; message?: string }
  | undefined

export async function validarSolicitacao(
  state: ValidacaoState,
  formData: FormData
): Promise<ValidacaoState> {
  const session = await getSession()
  if (!session?.podeValidar) redirect("/")

  const validated = ValidacaoSchema.safeParse({
    idSolicitacao: formData.get("idSolicitacao"),
    resultado:     formData.get("resultado"),
    justificativa: formData.get("justificativa") || undefined,
  })

  if (!validated.success) {
    return { errors: { justificativa: validated.error.flatten().fieldErrors.justificativa } }
  }

  const { idSolicitacao, resultado, justificativa } = validated.data

  const solicitacao = await prisma.solicitacaoPosse.findUnique({
    where: { id: idSolicitacao },
    include: { objeto: true },
  })
  if (!solicitacao || solicitacao.statusSolicitacao !== "PENDENTE") {
    return { message: "Solicitação não encontrada ou já processada." }
  }

  const novoStatusObjeto = resultado === "APROVADO"
    ? "DISPONIVEL_PARA_RETIRADA"
    : "ENCONTRADO"

  const novoStatusSolicitacao = resultado === "APROVADO" ? "APROVADA" : "REJEITADA"

  await prisma.validacao.create({
    data: { idSolicitacao, idValidador: session.userId, resultado, justificativa: justificativa ?? null },
  })

  await prisma.solicitacaoPosse.update({
    where: { id: idSolicitacao },
    data: { statusSolicitacao: novoStatusSolicitacao },
  })

  await prisma.objeto.update({
    where: { id: solicitacao.idObjeto },
    data: { status: novoStatusObjeto },
  })

  await prisma.historicoMovimentacao.create({
    data: {
      idObjeto:       solicitacao.idObjeto,
      idUsuario:      session.userId,
      statusAnterior: "EM_ANALISE",
      statusNovo:     novoStatusObjeto,
      acao:           resultado === "APROVADO" ? "Solicitação aprovada" : "Solicitação rejeitada",
      detalhes:       justificativa ?? null,
    },
  })

  await prisma.notificacao.create({
    data: {
      idUsuarioDestino: solicitacao.idSolicitante,
      idObjeto:         solicitacao.idObjeto,
      tipoNotificacao:  resultado === "APROVADO" ? "Solicitação Aprovada" : "Solicitação Rejeitada",
      mensagem:         resultado === "APROVADO"
        ? "Sua solicitação foi aprovada. Compareça para retirar o objeto."
        : `Sua solicitação foi rejeitada.${justificativa ? " Motivo: " + justificativa : ""}`,
    },
  })

  if (resultado === "APROVADO") {
    redirect(`/validacao/${idSolicitacao}/devolucao`)
  }

  redirect("/validacao")
}

// ─── Devolução ────────────────────────────────────────────────────────────────

const DevolucaoSchema = z.object({
  idSolicitacao: z.coerce.number().min(1),
  observacoes:   z.string().trim().optional(),
})

export type DevolucaoState =
  | { errors?: Record<string, string[]>; message?: string }
  | undefined

export async function registrarDevolucao(
  state: DevolucaoState,
  formData: FormData
): Promise<DevolucaoState> {
  const session = await getSession()
  if (!session?.podeValidar) redirect("/")

  const validated = DevolucaoSchema.safeParse({
    idSolicitacao: formData.get("idSolicitacao"),
    observacoes:   formData.get("observacoes") || undefined,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { idSolicitacao, observacoes } = validated.data

  const solicitacao = await prisma.solicitacaoPosse.findUnique({
    where: { id: idSolicitacao },
    include: { validacao: true },
  })

  if (!solicitacao || solicitacao.statusSolicitacao !== "APROVADA") {
    return { message: "Solicitação não encontrada ou não aprovada." }
  }

  const jaDevolvido = await prisma.devolucao.findUnique({ where: { idObjeto: solicitacao.idObjeto } })
  if (jaDevolvido) {
    return { message: "Este objeto já foi devolvido." }
  }

  const codigo = `SIGOP-${new Date().getFullYear()}-${String(solicitacao.idObjeto).padStart(4, "0")}-${Date.now().toString(36).toUpperCase()}`

  const devolucao = await prisma.devolucao.create({
    data: {
      idObjeto:          solicitacao.idObjeto,
      idSolicitacao:     idSolicitacao,
      idResponsavel:     session.userId,
      idBeneficiario:    solicitacao.idSolicitante,
      codigoComprovante: codigo,
      observacoes:       observacoes ?? null,
    },
  })

  await prisma.objeto.update({
    where: { id: solicitacao.idObjeto },
    data: { status: "ENCERRADO" },
  })

  await prisma.historicoMovimentacao.create({
    data: {
      idObjeto:       solicitacao.idObjeto,
      idUsuario:      session.userId,
      statusAnterior: "DISPONIVEL_PARA_RETIRADA",
      statusNovo:     "ENCERRADO",
      acao:           "Objeto devolvido ao proprietário",
      detalhes:       `Comprovante: ${codigo}`,
    },
  })

  await prisma.notificacao.create({
    data: {
      idUsuarioDestino: solicitacao.idSolicitante,
      idObjeto:         solicitacao.idObjeto,
      tipoNotificacao:  "Objeto Devolvido",
      mensagem:         `Seu objeto foi entregue. Comprovante: ${codigo}`,
    },
  })

  redirect(`/comprovante/${devolucao.id}`)
}

// ─── Encerrar registro de perda vinculado ─────────────────────────────────────

export async function encerrarRegistroPerda(formData: FormData) {
  const session = await getSession()
  if (!session?.podeValidar) redirect("/")

  const devolucaoId    = Number(formData.get("devolucaoId"))
  const objetoPerdidoId = Number(formData.get("objetoPerdidoId"))

  if (!devolucaoId || !objetoPerdidoId) redirect(`/comprovante/${devolucaoId}`)

  const devolucao = await prisma.devolucao.findUnique({
    where: { id: devolucaoId },
    select: { idBeneficiario: true },
  })
  if (!devolucao) redirect("/")

  const objeto = await prisma.objeto.findFirst({
    where: {
      id:     objetoPerdidoId,
      status: "PERDIDO",
      registrosPerdas: { some: { idUsuario: devolucao.idBeneficiario } },
    },
  })
  if (!objeto) redirect(`/comprovante/${devolucaoId}`)

  await prisma.objeto.update({
    where: { id: objetoPerdidoId },
    data:  { status: "ENCERRADO" },
  })

  await prisma.historicoMovimentacao.create({
    data: {
      idObjeto:       objetoPerdidoId,
      idUsuario:      session.userId,
      statusAnterior: "PERDIDO",
      statusNovo:     "ENCERRADO",
      acao:           "Registro de perda encerrado após devolução",
      detalhes:       `Vinculado à devolução ID ${devolucaoId}`,
    },
  })

  await prisma.notificacao.create({
    data: {
      idUsuarioDestino: devolucao.idBeneficiario,
      idObjeto:         objetoPerdidoId,
      tipoNotificacao:  "Objeto Encerrado",
      mensagem:         "Seu registro de perda foi encerrado — o objeto foi retirado no setor de Achados e Perdidos.",
    },
  })

  redirect(`/comprovante/${devolucaoId}?vinculado=1`)
}
