import LoginForm from "./login-form"

type Props = { searchParams: Promise<{ cadastro?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { cadastro } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🎒</div>
          <h1 className="text-2xl font-bold text-gray-900">SIGOP</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sistema de Gestão de Objetos Perdidos
          </p>
        </div>

        {cadastro === "ok" && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
            Conta criada com sucesso! Faça login para continuar.
          </div>
        )}

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-6 text-lg font-semibond text-gray-800">
            Acesse sua conta
          </h2>
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Não tem conta?{" "}
          <a href="/cadastro" className="font-medium text-blue-600 hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  )
}
