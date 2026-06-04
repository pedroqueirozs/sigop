"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/app/lib/db"
import { getSession } from "@/app/lib/session"

export async function marcarTodasLidas() {
  const session = await getSession()
  if (!session) return

  await prisma.notificacao.updateMany({
    where: { idUsuarioDestino: session.userId, lida: false },
    data: { lida: true, dataLeitura: new Date() },
  })

  revalidatePath("/notificacoes")
}
