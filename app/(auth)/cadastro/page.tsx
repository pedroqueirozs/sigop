import { prisma } from "@/app/lib/db"
import CadastroForm from "./cadastro-form"

export default async function CadastroPage() {
  const tipos = await prisma.tipoUsuario.findMany({
    where: { podeAdministrar: false },
    select: { id: true, descricao: true },
    orderBy: { descricao: "asc" },
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🎒</div>
          <h1 className="text-2xl font-bold text-gray-900">SIGOP</h1>
          <p className="mt-1 text-sm text-gray-500">Crie sua conta para acessar o sistema</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-6 text-lg font-semibold text-gray-800">Cadastro</h2>
          <CadastroForm tipos={tipos} />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Já tem conta?{" "}
          <a href="/login" className="font-medium text-blue-600 hover:underline">
            Fazer login
          </a>
        </p>
      </div>
    </div>
  )
}
