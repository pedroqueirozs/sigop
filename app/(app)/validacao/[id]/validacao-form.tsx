"use client"
import { useActionState } from "react"
import { validarSolicitacao } from "@/app/actions/solicitacao"

const INPUT = "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

export default function ValidacaoForm({ idSolicitacao }: { idSolicitacao: number }) {
  const [state, action, pending] = useActionState(validarSolicitacao, undefined)

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="idSolicitacao" value={idSolicitacao} />

      <div className="flex flex-col gap-1">
        <label htmlFor="justificativa" className="text-sm font-medium text-gray-700">
          Justificativa <span className="text-xs text-gray-400">(obrigatória em caso de rejeição)</span>
        </label>
        <textarea
          id="justificativa"
          name="justificativa"
          rows={3}
          placeholder="Descreva o motivo da sua decisão..."
          className={INPUT}
        />
        {state?.errors?.justificativa && (
          <p className="text-xs text-red-500">{state.errors.justificativa[0]}</p>
        )}
      </div>

      {state?.message && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.message}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          name="resultado"
          value="REJEITADO"
          disabled={pending}
          className="flex-1 rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
        >
          {pending ? "Processando..." : "❌ Rejeitar"}
        </button>
        <button
          type="submit"
          name="resultado"
          value="APROVADO"
          disabled={pending}
          className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
        >
          {pending ? "Processando..." : "✅ Aprovar"}
        </button>
      </div>
    </form>
  )
}
