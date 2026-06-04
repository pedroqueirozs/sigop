"use client"
import { useActionState, useState } from "react"
import Link from "next/link"
import { registrarEncontrado } from "@/app/actions/objeto"

const INPUT = "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
const LABEL = "text-sm font-medium text-gray-700"
const ERROR = "text-xs text-red-500 mt-0.5"

type Option = { id: number; nome: string }

export default function EncontradoForm({ categorias, locais }: { categorias: Option[]; locais: Option[] }) {
  const [state, action, pending] = useActionState(registrarEncontrado, undefined)
  const [previews, setPreviews] = useState<string[]>([])

  function handleFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  return (
    <form action={action} className="flex flex-col gap-5" encType="multipart/form-data">
      <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 ring-1 ring-amber-200">
        Ao registrar um objeto encontrado, o sistema notificará automaticamente possíveis proprietários.
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="descricao" className={LABEL}>
          Descrição do objeto <span className="text-red-500">*</span>
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={3}
          placeholder="Descreva o objeto com o máximo de detalhes possível..."
          className={INPUT}
        />
        {state?.errors?.descricao && <p className={ERROR}>{state.errors.descricao[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="idCategoria" className={LABEL}>
            Categoria <span className="text-red-500">*</span>
          </label>
          <select id="idCategoria" name="idCategoria" className={INPUT}>
            <option value="">Selecione...</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          {state?.errors?.idCategoria && <p className={ERROR}>{state.errors.idCategoria[0]}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="idLocal" className={LABEL}>
            Local onde foi encontrado <span className="text-red-500">*</span>
          </label>
          <select id="idLocal" name="idLocal" className={INPUT}>
            <option value="">Selecione...</option>
            {locais.map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
          </select>
          {state?.errors?.idLocal && <p className={ERROR}>{state.errors.idLocal[0]}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="marca" className={LABEL}>Marca</label>
          <input id="marca" name="marca" type="text" placeholder="Opcional" className={INPUT} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="cor" className={LABEL}>Cor predominante</label>
          <input id="cor" name="cor" type="text" placeholder="Opcional" className={INPUT} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="dataEncontrado" className={LABEL}>
            Data <span className="text-red-500">*</span>
          </label>
          <input id="dataEncontrado" name="dataEncontrado" type="date" className={INPUT} />
          {state?.errors?.dataEncontrado && <p className={ERROR}>{state.errors.dataEncontrado[0]}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="horaEncontrado" className={LABEL}>Hora aproximada</label>
          <input id="horaEncontrado" name="horaEncontrado" type="time" className={INPUT} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="localGuarda" className={LABEL}>
          Onde o objeto está guardado agora?
        </label>
        <input
          id="localGuarda"
          name="localGuarda"
          type="text"
          placeholder="Ex: Portaria principal, com a secretaria..."
          className={INPUT}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="descricaoCircunstancias" className={LABEL}>Circunstâncias do encontro</label>
        <textarea
          id="descricaoCircunstancias"
          name="descricaoCircunstancias"
          rows={2}
          placeholder="Como e onde você encontrou o objeto (opcional)"
          className={INPUT}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="observacoes" className={LABEL}>Observações adicionais</label>
        <textarea id="observacoes" name="observacoes" rows={2} placeholder="Opcional" className={INPUT} />
      </div>

      <div className="flex flex-col gap-2">
        <label className={LABEL}>
          Fotos do objeto
          <span className="ml-1 text-xs font-normal text-gray-400">(recomendado — ajuda o dono a identificar)</span>
        </label>
        <label
          htmlFor="fotos"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
        >
          <span className="text-2xl">📷</span>
          <span className="text-sm text-gray-500">Clique para selecionar fotos</span>
          <span className="text-xs text-gray-400">JPG ou PNG · máx. 5 MB cada</span>
          <input
            id="fotos"
            name="fotos"
            type="file"
            accept="image/jpeg,image/png"
            multiple
            className="hidden"
            onChange={handleFotos}
          />
        </label>

        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {previews.map((src, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg ring-1 ring-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-blue-600/80 py-0.5 text-center text-[10px] text-white">
                    principal
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {state?.message && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.message}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
        >
          {pending ? "Registrando..." : "Registrar objeto encontrado"}
        </button>
      </div>
    </form>
  )
}
