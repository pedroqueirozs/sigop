import { prisma } from "@/app/lib/db"
import EncontradoForm from "./encontrado-form"

export default async function RegistrarEncontradoPage() {
  const [categorias, locais] = await Promise.all([
    prisma.categoriaObjeto.findMany({ select: { id: true, nome: true }, orderBy: { nome: "asc" } }),
    prisma.local.findMany({ where: { ativo: true }, select: { id: true, nome: true }, orderBy: { nome: "asc" } }),
  ])

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Registrar objeto encontrado</h1>
        <p className="mt-1 text-sm text-gray-500">
          Encontrou algo no campus? Registre aqui para ajudar o dono a recuperá-lo.
        </p>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <EncontradoForm categorias={categorias} locais={locais} />
      </div>
    </div>
  )
}
