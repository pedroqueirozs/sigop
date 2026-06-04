import Link from "next/link"

export default function RegistrarPage() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Registrar</h1>
        <p className="mt-1 text-sm text-gray-500">O que você deseja registrar?</p>
      </div>

      <div className="flex flex-col gap-4">
        <Link
          href="/registrar/perda"
          className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition hover:ring-red-400"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-100 text-3xl">
            📋
          </div>
          <div>
            <p className="font-semibold text-gray-900">Perdi um objeto</p>
            <p className="mt-0.5 text-sm text-gray-500">
              Registre a perda para que outros usuários possam identificar e devolver seu item.
            </p>
          </div>
          <span className="ml-auto text-gray-400">→</span>
        </Link>

        <Link
          href="/registrar/encontrado"
          className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition hover:ring-green-400"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-100 text-3xl">
            📦
          </div>
          <div>
            <p className="font-semibold text-gray-900">Encontrei um objeto</p>
            <p className="mt-0.5 text-sm text-gray-500">
              Registre o objeto encontrado para ajudar o dono a recuperá-lo.
            </p>
          </div>
          <span className="ml-auto text-gray-400">→</span>
        </Link>
      </div>
    </div>
  )
}
