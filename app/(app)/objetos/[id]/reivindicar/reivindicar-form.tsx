"use client"
import { useActionState } from "react"
import Link from "next/link"
import { solicitarPosse } from "@/app/actions/solicitacao"

const INPUT = "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

export default function ReivindicarForm({ idObjeto }: { idObjeto: number }) {
  const [state, action, pending] = useActionState(solicitarPosse, undefined)

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="idObjeto" value={idObjeto} />

      <div className="rounded-xl bg-blue-50 p-4 ring-1 ring-blue-200">
        <p className="font-medium text-blue-900">📍 Como funciona</p>
        <ol className="mt-2 flex flex-col gap-1.5 text-sm text-blue-800">
          <li>1. Registre sua solicitação abaixo</li>
          <li>2. Compareça ao <strong>Achados e Perdidos</strong> com um documento de identificação</li>
          <li>3. O responsável confirmará sua identidade e entregará o objeto</li>
          <li>4. Um recibo será gerado e você assina a retirada</li>
        </ol>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="descricaoReivindicacao" className="text-sm font-medium text-gray-700">
          Como você sabe que este objeto é seu? <span className="text-red-500">*</span>
        </label>
        <textarea
          id="descricaoReivindicacao"
          name="descricaoReivindicacao"
          rows={3}
          placeholder="Ex: É meu notebook, tenho a nota fiscal. / É minha carteira preta com foto de família dentro..."
          className={INPUT}
        />
        {state?.errors?.descricaoReivindicacao && (
          <p className="text-xs text-red-500">{state.errors.descricaoReivindicacao[0]}</p>
        )}
      </div>

      {state?.message && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.message}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          href={`/objetos/${idObjeto}`}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Enviando..." : "Solicitar retirada"}
        </button>
      </div>
    </form>
  )
}
