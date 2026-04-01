'use client'
import { FuelType } from '@/lib/types'

interface FuelTypeSelectorProps {
  value: FuelType
  onChange: (fuelType: FuelType, dutyPerCC: number) => void
}

const FUEL_TYPES: { value: FuelType; label: string; dutyPerCC: number }[] = [
  { value: 'petrol', label: 'Petrol', dutyPerCC: 3200 },
  { value: 'diesel', label: 'Diesel', dutyPerCC: 3500 },
  { value: 'electric', label: 'Electric', dutyPerCC: 0 },
  { value: 'petrol_hybrid', label: 'Petrol Hybrid', dutyPerCC: 2000 },
  { value: 'diesel_hybrid', label: 'Diesel Hybrid', dutyPerCC: 2500 },
  { value: 'epower_hybrid', label: 'E-Power Hybrid', dutyPerCC: 2000 },
  { value: 'plugin_hybrid', label: 'Plug-in Hybrid', dutyPerCC: 1500 },
]

export default function FuelTypeSelector({ value, onChange }: FuelTypeSelectorProps) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex gap-2 min-w-max">
        {FUEL_TYPES.map((ft) => (
          <button
            key={ft.value}
            type="button"
            onClick={() => onChange(ft.value, ft.dutyPerCC)}
            className={`px-3 py-2 rounded-full text-sm font-semibold border transition-all duration-150 whitespace-nowrap ${
              value === ft.value
                ? 'bg-[#1a56db] text-white border-[#1a56db]'
                : 'bg-white text-gray-500 border-gray-300 hover:border-[#1a56db] hover:text-[#1a56db]'
            }`}
          >
            {ft.label}
          </button>
        ))}
      </div>
    </div>
  )
}
