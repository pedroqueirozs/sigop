"use client"
import { useActionState } from "react"
import { cadastrar } from "@/app/actions/auth"

const INPUT_CLASS =
  "rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 w-full"

type TipoUsuario = { id: number; descricao: string }

export default function CadastroForm({ tipos }: { tipos: TipoUsuario[] }) {
  const [state, action, pending] = useActionState(cadastrar, undefined)

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="nome" className="text-sm font-medium text-gray-700">
          Nome completo <span className="text-red-500">*</span>
        </label>
        <input id="nome" name="nome" type="text" placeholder="Seu nome completo" className={INPUT_CLASS} />
        {state?.errors?.nome && <p className="text-xs text-red-500">{state.errors.nome[0]}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          E-mail institucional <span className="text-red-500">*</span>
        </label>
        <input id="email" name="email" type="email" placeholder="seu@email.com" autoComplete="email" className={INPUT_CLASS} />
        {state?.errors?.email && <p className="text-xs text-red-500">{state.errors.email[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="cpf" className="text-sm font-medium text-gray-700">
            CPF <span className="text-red-500">*</span>
          </label>
          <input id="cpf" name="cpf" type="text" placeholder="Somente números" maxLength={11} className={INPUT_CLASS} />
          {state?.errors?.cpf && <p className="text-xs text-red-500">{state.errors.cpf[0]}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="matricula" className="text-sm font-medium text-gray-700">
            Matrícula / SIAPE
          </label>
          <input id="matricula" name="matricula" type="text" placeholder="Opcional" className={INPUT_CLASS} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="telefone" className="text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input id="telefone" name="telefone" type="tel" placeholder="Opcional" className={INPUT_CLASS} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="idTipoUsuario" className="text-sm font-medium text-gray-700">
            Tipo de usuário <span className="text-red-500">*</span>
          </label>
          <select id="idTipoUsuario" name="idTipoUsuario" className={INPUT_CLASS}>
            <option value="">Selecione...</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.descricao}
              </option>
            ))}
          </select>
          {state?.errors?.idTipoUsuario && (
            <p className="text-xs text-red-500">{state.errors.idTipoUsuario[0]}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Senha <span className="text-red-500">*</span>
        </label>
        <input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" autoComplete="new-password" className={INPUT_CLASS} />
        {state?.errors?.password && <p className="text-xs text-red-500">{state.errors.password[0]}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Confirmar senha <span className="text-red-500">*</span>
        </label>
        <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repita a senha" autoComplete="new-password" className={INPUT_CLASS} />
        {state?.errors?.confirmPassword && (
          <p className="text-xs text-red-500">{state.errors.confirmPassword[0]}</p>
        )}
      </div>

      {state?.message && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  )
}
