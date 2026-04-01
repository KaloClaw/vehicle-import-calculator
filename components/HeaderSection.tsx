'use client'
import { BUSINESS_CONFIG } from '@/lib/config'

export default function HeaderSection() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-9 h-9 bg-[#1e3a5f] rounded-lg flex items-center justify-center shadow-sm shrink-0">
            <span className="text-base">🚗</span>
          </div>
          <div>
            <h1 className="text-base font-black text-[#1e3a5f] uppercase leading-tight">
              Vehicle Import Tax Calculator
            </h1>
            <p className="text-xs text-[#1a56db] font-semibold">Sri Lanka · Estimate Only</p>
          </div>
        </div>
      </div>
    </header>
  )
}
