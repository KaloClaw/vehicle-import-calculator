'use client'
import { useState, useCallback } from 'react'
import { CalculatorState, CalculationResult, Currency, VehicleCategory } from '@/lib/types'
import ResultField from './ResultField'
import FuelTypeSelector from './FuelTypeSelector'
import LocalCostAccordion from './LocalCostAccordion'
import SettlementBox from './SettlementBox'
import { formatLKRFull, formatPercent } from '@/lib/formatters'

// Free exchange rate API (no key needed)
async function fetchRate(currency: Currency): Promise<number | null> {
  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
    const data = await res.json()
    return data?.rates?.LKR ?? null
  } catch {
    return null
  }
}

interface CalculatorPanelProps {
  state: CalculatorState
  onChange: (updates: Partial<CalculatorState>) => void
  result: CalculationResult
}

const CURRENCIES: Currency[] = ['JPY', 'USD', 'NZD']
const CATEGORIES: { value: VehicleCategory; label: string }[] = [
  { value: 'car', label: 'Car' },
  { value: 'suv', label: 'SUV' },
  { value: 'jeep', label: 'Jeep' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'van', label: 'Van' },
]

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] bg-white'
const labelClass = 'block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide'

export default function CalculatorPanel({ state, onChange, result }: CalculatorPanelProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [rateLoading, setRateLoading] = useState(false)
  const [rateMsg, setRateMsg] = useState<string | null>(null)

  const handleFetchRate = useCallback(async () => {
    setRateLoading(true)
    setRateMsg(null)
    const rate = await fetchRate(state.currency)
    setRateLoading(false)
    if (rate) {
      onChange({ exchangeRate: Math.round(rate * 100) / 100 })
      setRateMsg(`✓ Updated: 1 ${state.currency} = LKR ${(Math.round(rate * 100) / 100).toLocaleString()}`)
      setTimeout(() => setRateMsg(null), 4000)
    } else {
      setRateMsg('⚠ Could not fetch rate. Check connection.')
      setTimeout(() => setRateMsg(null), 3000)
    }
  }, [state.currency, onChange])

  const salePrice = state.mode === 'actual' ? state.actualSellingPrice : state.expectedSellingPrice

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-4">
      {/* ─── Section 1: Import Values ─── */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-black text-[#1e3a5f] uppercase tracking-wider mb-3">
          🌍 Import Values
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>FOB Value</label>
            <input
              type="number"
              min="0"
              value={state.fob || ''}
              onChange={(e) => onChange({ fob: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Insurance + Freight</label>
            <input
              type="number"
              min="0"
              value={state.insuranceFreight || ''}
              onChange={(e) => onChange({ insuranceFreight: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-3">
          <label className={labelClass}>Currency</label>
          <div className="flex gap-2">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChange({ currency: c })}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-colors duration-150 min-h-[44px] ${
                  state.currency === c
                    ? 'bg-[#1a56db] text-white border-[#1a56db]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#1a56db]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className={labelClass}>Exchange Rate (LKR)</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={state.exchangeRate || ''}
                onChange={(e) => onChange({ exchangeRate: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
              <button
                type="button"
                onClick={handleFetchRate}
                disabled={rateLoading}
                title="Fetch today's live rate"
                className="shrink-0 bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-700 rounded-lg px-2 text-lg transition-colors disabled:opacity-50 min-h-[44px]"
              >
                {rateLoading ? '⏳' : '🔄'}
              </button>
            </div>
            {rateMsg && (
              <p className={`text-xs mt-1 font-medium ${rateMsg.startsWith('✓') ? 'text-green-700' : 'text-red-600'}`}>
                {rateMsg}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>Manufacture Year</label>
            <input
              type="number"
              min="1990"
              max="2030"
              value={state.manufactureYear || ''}
              onChange={(e) => onChange({ manufactureYear: parseInt(e.target.value) || 2024 })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* ─── Section 2: Tax Results ─── */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-black text-[#1e3a5f] uppercase tracking-wider mb-3">
          💰 Tax Calculation Results
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <ResultField label="CIF in LKR" value={formatLKRFull(result.cifLKR)} />
          <ResultField label="General Duty" value={formatLKRFull(result.generalDuty)} />
          <ResultField label="Excise Duty" value={formatLKRFull(result.exciseDuty)} />
          <ResultField label="Luxury Tax" value={formatLKRFull(result.luxuryTax)} />
          <ResultField label="VAT" value={formatLKRFull(result.vat)} />
          <ResultField label="SSCL" value={formatLKRFull(result.sscl)} />
        </div>
        <div className="mt-2">
          <ResultField label="Total Tax Amount" value={formatLKRFull(result.totalTax)} size="lg" variant="highlight" />
        </div>
        <div className="border-t border-dashed border-gray-300 my-3" />
        <div className="grid grid-cols-2 gap-2">
          <ResultField label="My Cash Exposure" value={formatLKRFull(result.myCashExposure)} variant="highlight" />
          <ResultField label="Total Calculation" value={formatLKRFull(result.totalCalculation)} size="lg" variant="total" />
        </div>
      </div>

      {/* ─── Section 3: Vehicle Details ─── */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-black text-[#1e3a5f] uppercase tracking-wider mb-3">
          🚗 Vehicle Details
        </h3>
        <div className="mb-3">
          <label className={labelClass}>Vehicle Name</label>
          <input
            type="text"
            value={state.vehicleName}
            onChange={(e) => onChange({ vehicleName: e.target.value })}
            placeholder="e.g. Kia Seltos 2025"
            className={inputClass}
          />
        </div>

        <div className="mb-3">
          <label className={labelClass}>Fuel Type</label>
          <FuelTypeSelector
            value={state.fuelType}
            onChange={(fuelType, dutyPerCC) => onChange({ fuelType, dutyPerCC })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>Engine CC</label>
            <input
              type="number"
              min="0"
              value={state.engineCC || ''}
              onChange={(e) => onChange({ engineCC: parseInt(e.target.value) || 0 })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>HS Code</label>
            <input
              type="text"
              value={state.hsCode}
              onChange={(e) => onChange({ hsCode: e.target.value })}
              placeholder="e.g. 8703.23"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => onChange({ category: cat.value })}
                className={`px-3 py-2 rounded-full text-sm font-semibold border whitespace-nowrap min-h-[44px] transition-colors duration-150 ${
                  state.category === cat.value
                    ? 'bg-[#1a56db] text-white border-[#1a56db]'
                    : 'bg-white text-gray-500 border-gray-300 hover:border-[#1a56db]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Section 4: Advanced Tax Settings ─── */}
      <div className="border-b border-gray-100">
        <button
          type="button"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-semibold text-gray-700">⚙️ Advanced Tax Settings</span>
          <span className="text-gray-400 text-sm">{advancedOpen ? '▲' : '▼'}</span>
        </button>

        {advancedOpen && (
          <div className="p-4 grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Customs Duty %</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={state.customsDutyPercent}
                onChange={(e) => onChange({ customsDutyPercent: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Surcharge %</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={state.surchargePercent}
                onChange={(e) => onChange({ surchargePercent: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Excise Type</label>
              <div className="flex gap-2">
                {(['per_cc', 'percentage', 'fixed'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onChange({ exciseType: t })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-colors min-h-[44px] ${
                      state.exciseType === t
                        ? 'bg-[#1a56db] text-white border-[#1a56db]'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    {t === 'per_cc' ? 'Per CC' : t === 'percentage' ? 'Percentage' : 'Fixed'}
                  </button>
                ))}
              </div>
            </div>
            {state.exciseType === 'per_cc' && (
              <div className="col-span-2">
                <label className={labelClass}>Duty per CC (LKR)</label>
                <input
                  type="number"
                  min="0"
                  value={state.dutyPerCC}
                  onChange={(e) => onChange({ dutyPerCC: parseFloat(e.target.value) || 0 })}
                  className={inputClass}
                />
              </div>
            )}
            {state.exciseType === 'percentage' && (
              <div className="col-span-2">
                <label className={labelClass}>Excise %</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={state.excisePercent}
                  onChange={(e) => onChange({ excisePercent: parseFloat(e.target.value) || 0 })}
                  className={inputClass}
                />
              </div>
            )}
            {state.exciseType === 'fixed' && (
              <div className="col-span-2">
                <label className={labelClass}>Fixed Excise (LKR)</label>
                <input
                  type="number"
                  min="0"
                  value={state.exciseFixed}
                  onChange={(e) => onChange({ exciseFixed: parseFloat(e.target.value) || 0 })}
                  className={inputClass}
                />
              </div>
            )}
            <div>
              <label className={labelClass}>VAT %</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={state.vatPercent}
                onChange={(e) => onChange({ vatPercent: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>SSCL %</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={state.ssclPercent}
                onChange={(e) => onChange({ ssclPercent: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Luxury Tax %</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={state.luxuryTaxPercent}
                onChange={(e) => onChange({ luxuryTaxPercent: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Luxury Tax Threshold LKR</label>
              <input
                type="number"
                min="0"
                value={state.luxuryTaxThreshold}
                onChange={(e) => onChange({ luxuryTaxThreshold: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── Section 5: Local Costs ─── */}
      <div className="p-4 border-b border-gray-100">
        <LocalCostAccordion
          state={state}
          onChange={onChange}
          totalLocalCosts={result.totalLocalCosts}
        />
      </div>

      {/* ─── Section 6: Selling & Settlement ─── */}
      <div className="p-4">
        <h3 className="text-sm font-black text-[#1e3a5f] uppercase tracking-wider mb-3">
          📈 Selling &amp; Settlement
        </h3>

        {/* Mode Toggle */}
        <div className="mb-4">
          <label className={labelClass}>Mode</label>
          <div className="flex gap-2">
            {(['estimate', 'actual'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onChange({ mode: m })}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-colors min-h-[44px] ${
                  state.mode === m
                    ? 'bg-[#1a56db] text-white border-[#1a56db]'
                    : 'bg-white text-gray-600 border-gray-300'
                }`}
              >
                {m === 'estimate' ? '📊 Estimate' : '✅ Actual'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-4">
          {state.mode === 'estimate' ? (
            <div>
              <label className={labelClass}>Expected Selling Price (LKR)</label>
              <input
                type="number"
                min="0"
                value={state.expectedSellingPrice || ''}
                onChange={(e) => onChange({ expectedSellingPrice: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className={inputClass}
              />
            </div>
          ) : (
            <div>
              <label className={labelClass}>Actual Selling Price (LKR)</label>
              <input
                type="number"
                min="0"
                value={state.actualSellingPrice || ''}
                onChange={(e) => onChange({ actualSellingPrice: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Nalin's Original Vehicle Cost (LKR)</label>
            <input
              type="number"
              min="0"
              value={state.relativeOriginalCost || ''}
              onChange={(e) => onChange({ relativeOriginalCost: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              My Profit Split: <span className="text-[#1a56db] font-bold">{state.profitSplitMyPercent}%</span>
              {' · '}Nalin: {100 - state.profitSplitMyPercent}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={state.profitSplitMyPercent}
              onChange={(e) => onChange({ profitSplitMyPercent: parseInt(e.target.value) })}
              className="w-full h-3 accent-[#1a56db] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>
        </div>

        {/* Settlement Results */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <ResultField label="Break-Even Price" value={formatLKRFull(result.breakEvenPrice)} variant="highlight" />
          <ResultField
            label="Net Profit Pool"
            value={formatLKRFull(result.netProfitPool)}
            variant={result.isLoss ? 'negative' : 'positive'}
          />
          <ResultField label="My Share" value={formatLKRFull(result.myShare)} variant={result.isLoss ? 'negative' : 'positive'} />
          <ResultField label="Nalin's Share" value={formatLKRFull(result.relativeShare)} />
        </div>

        {/* ROI / Margin */}
        {(result.myShare !== 0 || result.profitMarginPercent !== 0) && (
          <div className="grid grid-cols-2 gap-2 mb-3 bg-gray-50 rounded-xl p-3">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Profit Margin</p>
              <p className={`text-lg font-black ${result.isLoss ? 'text-red-600' : 'text-green-700'}`}>
                {formatPercent(result.profitMarginPercent)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">My ROI</p>
              <p className={`text-lg font-black ${result.isLoss ? 'text-red-600' : 'text-green-700'}`}>
                {formatPercent(result.myROI)}
              </p>
            </div>
          </div>
        )}

        {/* Settlement Box */}
        <SettlementBox
          result={result}
          salePrice={salePrice}
          relativeOriginalCost={state.relativeOriginalCost}
          profitSplitMyPercent={state.profitSplitMyPercent}
        />
      </div>
    </div>
  )
}
