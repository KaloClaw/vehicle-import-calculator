'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import HeaderSection from '@/components/HeaderSection'
import WarningBox from '@/components/WarningBox'
import CalculatorPanel from '@/components/CalculatorPanel'
import CTAButtons from '@/components/CTAButtons'
import VehicleGrid from '@/components/VehicleGrid'
import { CalculatorState } from '@/lib/types'
import { calculate } from '@/lib/formulas'
import { saveState, loadState, clearState } from '@/lib/storage'
import { DEFAULT_STATE, SAMPLE_VEHICLES } from '@/lib/vehicles'
import { VehicleCardData } from '@/lib/types'

export default function Home() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE)
  const [toast, setToast] = useState<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load saved state on mount
  useEffect(() => {
    const saved = loadState()
    if (saved) {
      setState(saved)
    }
  }, [])

  // Debounced auto-save
  const handleChange = useCallback((updates: Partial<CalculatorState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates }
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => saveState(next), 500)
      return next
    })
  }, [])

  const result = calculate(state)

  const handleVehicleSelect = useCallback((vehicle: VehicleCardData) => {
    const updates: Partial<CalculatorState> = {
      vehicleName: vehicle.name,
      fuelType: vehicle.fuelType,
      engineCC: vehicle.engineCC,
      hsCode: vehicle.hsCode,
      manufactureYear: vehicle.manufactureYear,
      fob: vehicle.fob,
      insuranceFreight: vehicle.insuranceFreight,
      currency: vehicle.currency,
      exchangeRate: vehicle.exchangeRate,
      expectedSellingPrice: vehicle.expectedSellPriceLKR,
      customsDutyPercent: vehicle.customsDutyPercent,
      dutyPerCC: vehicle.dutyPerCC,
      exciseType: 'per_cc',
    }
    handleChange(updates)
    setToast(`${vehicle.name} loaded ✓`)
    setTimeout(() => setToast(null), 2500)
    // Scroll to top on mobile
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [handleChange])

  const handleReset = useCallback(() => {
    clearState()
    setState(DEFAULT_STATE)
    setToast('Calculator reset ✓')
    setTimeout(() => setToast(null), 2000)
  }, [])

  const handleSave = useCallback(() => {
    saveState(state)
    setToast('Saved! ✓')
    setTimeout(() => setToast(null), 2000)
  }, [state])

  return (
    <main className="min-h-screen pb-24 md:pb-0">
      <HeaderSection />

      <div className="container mx-auto px-3 md:px-4 py-3 md:py-6 max-w-7xl">
        {/* Mobile: vehicles strip first as quick-select, then calculator */}
        <div className="lg:hidden mb-4">
          <VehicleGrid vehicles={SAMPLE_VEHICLES} onSelect={handleVehicleSelect} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* LEFT: Calculator */}
          <div>
            <WarningBox />
            <CalculatorPanel state={state} onChange={handleChange} result={result} />
            <CTAButtons onReset={handleReset} onSave={handleSave} />
          </div>

          {/* RIGHT: Vehicle Grid (desktop only — mobile shown above) */}
          <div className="hidden lg:block">
            <VehicleGrid vehicles={SAMPLE_VEHICLES} onSelect={handleVehicleSelect} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1e3a5f] text-white text-center py-6 mt-8">
        <p className="text-sm font-semibold">© 2025 Vehicle Import Calculator · All Rights Reserved</p>
        <p className="text-xs text-blue-300 mt-1">
          Tax calculations are estimates. Confirm with a licensed customs agent.
        </p>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1e3a5f] text-white px-6 py-3 rounded-full shadow-xl text-sm font-semibold animate-bounce">
          {toast}
        </div>
      )}
    </main>
  )
}
