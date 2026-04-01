'use client'
import Image from 'next/image'
import { VehicleCardData } from '@/lib/types'
import { formatLKR } from '@/lib/formatters'

interface VehicleCardProps {
  vehicle: VehicleCardData
  onSelect: (vehicle: VehicleCardData) => void
  compact?: boolean
}

const badgeStyles = {
  green: 'bg-green-100 text-green-800 border-green-300',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  red: 'bg-red-100 text-red-800 border-red-300',
}

const fuelLabels: Record<string, string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  electric: 'EV ⚡',
  petrol_hybrid: 'Hybrid',
  diesel_hybrid: 'D-Hybrid',
  epower_hybrid: 'e-POWER',
  plugin_hybrid: 'Plug-in',
}

export default function VehicleCard({ vehicle, onSelect, compact = false }: VehicleCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl hover:border-[#1a56db] border-2 border-transparent transition-all duration-200 cursor-pointer overflow-hidden active:scale-95"
      onClick={() => onSelect(vehicle)}
    >
      {/* Image */}
      <div className={`relative w-full bg-gray-100 ${compact ? 'h-28' : 'h-40'}`}>
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full border ${badgeStyles[vehicle.badgeColor]}`}>
            {fuelLabels[vehicle.fuelType] || vehicle.fuelType}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className={compact ? 'p-2' : 'p-3'}>
        <h3 className={`font-bold text-[#1e3a5f] leading-tight ${compact ? 'text-xs' : 'text-sm'}`}>
          {vehicle.name}
        </h3>
        {!compact && <p className="text-xs text-gray-500 mt-0.5">{vehicle.subtitle}</p>}

        <div className={`flex items-center justify-between ${compact ? 'mt-1.5' : 'mt-2'}`}>
          <span className={`font-bold px-2 py-0.5 rounded-lg border ${badgeStyles[vehicle.badgeColor]} ${compact ? 'text-xs' : 'text-sm'}`}>
            {formatLKR(vehicle.expectedSellPriceLKR)}
          </span>
          {!compact && (
            <button
              type="button"
              className="text-xs font-semibold text-[#1a56db] hover:text-white hover:bg-[#1a56db] border border-[#1a56db] px-3 py-1 rounded-full transition-colors duration-150"
            >
              Load →
            </button>
          )}
        </div>

        {compact ? (
          <p className="text-xs text-gray-400 mt-1">{vehicle.manufactureYear} · {vehicle.engineCC}cc</p>
        ) : (
          <p className="text-xs text-gray-400 mt-1">{vehicle.manufactureYear} · {vehicle.engineCC}cc · {vehicle.currency} {vehicle.fob.toLocaleString()}</p>
        )}
      </div>
    </div>
  )
}
