"use client"
import { useActionState } from "react"
import { registrarDevolucao } from "@/app/actions/solicitacao"

const INPUT = "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

export default function DevolucaoForm({ idSolicitacao }: { idSolicitacao: number }) {
  const [state, action, pending] = useActionState(registrarDevolucao, undefined)

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="idSolicitacao" value={idSolicitacao} />

      <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 ring-1 ring-amber-200">
        Confirme que o objeto foi entregue fisicamente ao beneficiário antes de registrar.
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="observacoes" className="text-sm font-medium text-gray-700">Observações</label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={2}
          placeholder="Ex: Beneficiário apresentou documento de identidade..."
          className={INPUT}
        />
      </div>

      {state?.message && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
      >
        {pending ? "Registrando..." : "✅ Confirmar devolução e emitir comprovante"}
      </button>
    </form>
  )
}
