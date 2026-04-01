'use client'
import { useState } from 'react'
import { CalculatorState } from '@/lib/types'
import { formatLKRFull } from '@/lib/formatters'

interface LocalCostAccordionProps {
  state: CalculatorState
  onChange: (updates: Partial<CalculatorState>) => void
  totalLocalCosts: number
}

const COST_FIELDS: { key: keyof CalculatorState; label: string }[] = [
  { key: 'portCharges', label: 'Port Charges' },
  { key: 'clearingFee', label: 'Clearing Fee' },
  { key: 'registrationCost', label: 'Registration Cost' },
  { key: 'transport', label: 'Transport' },
  { key: 'detailing', label: 'Detailing' },
  { key: 'advertising', label: 'Advertising' },
  { key: 'miscellaneous', label: 'Miscellaneous' },
]

export default function LocalCostAccordion({ state, onChange, totalLocalCosts }: LocalCostAccordionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">🏭 Local Costs</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
            {formatLKRFull(totalLocalCosts)}
          </span>
        </div>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 py-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COST_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
              <input
                type="number"
                min="0"
                value={state[key] as number}
                onChange={(e) => onChange({ [key]: parseFloat(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
