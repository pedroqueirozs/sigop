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

      <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700 ring-1 ring-blue-200">
        Descreva características que comprovem que o objeto é seu. Quanto mais específico, maior a chance de aprovação.
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="descricaoReivindicacao" className="text-sm font-medium text-gray-700">
          Por que este objeto é seu? <span className="text-red-500">*</span>
        </label>
        <textarea
          id="descricaoReivindicacao"
          name="descricaoReivindicacao"
          rows={4}
          placeholder="Ex: O notebook tem meu nome em etiqueta na parte inferior, há um arranhão no lado esquerdo da tampa..."
          className={INPUT}
        />
        {state?.errors?.descricaoReivindicacao && (
          <p className="text-xs text-red-500">{state.errors.descricaoReivindicacao[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
        <p className="text-sm font-medium text-gray-700">Evidência de propriedade (opcional)</p>

        <div className="flex flex-col gap-1">
          <label htmlFor="tipoEvidencia" className="text-sm text-gray-600">Tipo de evidência</label>
          <select id="tipoEvidencia" name="tipoEvidencia" className={INPUT}>
            <option value="">Nenhuma</option>
            <option value="Nota fiscal">Nota fiscal</option>
            <option value="Foto com o objeto">Foto com o objeto</option>
            <option value="Número de série">Número de série</option>
            <option value="Documento com foto">Documento com foto</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="descricaoEvidencia" className="text-sm text-gray-600">Descrição da evidência</label>
          <textarea
            id="descricaoEvidencia"
            name="descricaoEvidencia"
            rows={2}
            placeholder="Descreva a evidência que você possui..."
            className={INPUT}
          />
          {state?.errors?.descricaoEvidencia && (
            <p className="text-xs text-red-500">{state.errors.descricaoEvidencia[0]}</p>
          )}
        </div>
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
          {pending ? "Enviando..." : "Enviar solicitação"}
        </button>
      </div>
    </form>
  )
}
