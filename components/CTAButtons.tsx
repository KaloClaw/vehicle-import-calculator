'use client'

interface CTAButtonsProps {
  onReset: () => void
  onSave: () => void
}

export default function CTAButtons({ onReset, onSave }: CTAButtonsProps) {
  const handlePrint = () => window.print()

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex flex-wrap gap-3 mt-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-3 rounded-xl transition-colors duration-200 text-sm"
        >
          🔄 Reset
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-3 rounded-xl transition-colors duration-200 text-sm"
        >
          💾 Save
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-4 py-3 rounded-xl transition-colors duration-200 text-sm"
        >
          🖨️ Print
        </button>
      </div>

      {/* Mobile: fixed bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 shadow-2xl">
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 inline-flex items-center justify-center bg-gray-200 text-gray-700 font-semibold px-3 py-3 rounded-xl text-sm"
          >
            🔄 Reset
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 inline-flex items-center justify-center bg-blue-100 text-blue-700 font-semibold px-3 py-3 rounded-xl text-sm"
          >
            💾 Save
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center bg-gray-100 text-gray-600 font-semibold px-3 py-3 rounded-xl text-sm"
          >
            🖨️ Print
          </button>
        </div>
      </div>
    </>
  )
}
