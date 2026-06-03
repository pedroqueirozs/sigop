import { notFound, redirect } from "next/navigation"
import { prisma } from "@/app/lib/db"
import { getSession } from "@/app/lib/session"
import ReivindicarForm from "./reivindicar-form"

type Props = { params: Promise<{ id: string }> }

export default async function ReivindicarPage({ params }: Props) {
  const { id } = await params
  const session = await getSession()
  if (!session) redirect("/login")

  const objeto = await prisma.objeto.findUnique({
    where: { id: Number(id) },
    include: { categoria: true },
  })

  if (!objeto || objeto.status !== "ENCONTRADO") notFound()

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Reivindicar propriedade</h1>
        <p className="mt-1 text-sm text-gray-500">
          Objeto: <span className="font-medium text-gray-700">{objeto.descricao.slice(0, 60)}</span>
        </p>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <ReivindicarForm idObjeto={objeto.id} />
      </div>
    </div>
  )
}
