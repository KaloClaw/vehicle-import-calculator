'use client'
import VehicleCard from './VehicleCard'
import { VehicleCardData } from '@/lib/types'

interface VehicleGridProps {
  vehicles: VehicleCardData[]
  onSelect: (vehicle: VehicleCardData) => void
}

export default function VehicleGrid({ vehicles, onSelect }: VehicleGridProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#1e3a5f]">🚘 Available Vehicles</h2>
          <p className="text-xs text-gray-500">Tap any vehicle to load into calculator</p>
        </div>
      </div>

      {/* Mobile: horizontal scroll strip */}
      <div className="lg:hidden -mx-4 px-4">
        <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="snap-start shrink-0 w-48">
              <VehicleCard vehicle={vehicle} onSelect={onSelect} compact />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}
