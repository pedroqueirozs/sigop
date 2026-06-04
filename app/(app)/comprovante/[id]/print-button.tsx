"use client"

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
      🖨️ Imprimir recibo
    </button>
  )
}
