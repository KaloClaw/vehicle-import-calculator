import { CalculationResult } from '@/lib/types'
import { formatLKRFull } from '@/lib/formatters'
import { BUSINESS_CONFIG } from '@/lib/config'

interface SettlementBoxProps {
  result: CalculationResult
  salePrice: number
  relativeOriginalCost: number
  profitSplitMyPercent: number
}

export default function SettlementBox({
  result,
  salePrice,
  relativeOriginalCost,
  profitSplitMyPercent,
}: SettlementBoxProps) {
  const relativeSharePercent = 100 - profitSplitMyPercent
  const relativeName = BUSINESS_CONFIG.relativeName

  return (
    <div className="bg-[#f0f4ff] border border-blue-200 rounded-xl p-4 mt-4">
      <h3 className="text-sm font-black text-[#1e3a5f] uppercase tracking-wider mb-3 text-center">
        📋 How the Settlement Works
      </h3>
      <div className="space-y-3">
        <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
          <span className="text-lg">🚗</span>
          <div>
            <p className="text-xs font-bold text-gray-700">1. Vehicle Sold</p>
            <p className="text-sm text-gray-600">
              Sale Price: <strong className="text-[#1e3a5f]">{formatLKRFull(salePrice)}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
          <span className="text-lg">💰</span>
          <div>
            <p className="text-xs font-bold text-gray-700">2. Return {relativeName}&apos;s Vehicle Cost</p>
            <p className="text-sm text-gray-600">
              {relativeName} paid: <strong className="text-[#1e3a5f]">{formatLKRFull(relativeOriginalCost)}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
          <span className="text-lg">🔧</span>
          <div>
            <p className="text-xs font-bold text-gray-700">3. Recover My Sri Lanka Costs</p>
            <p className="text-sm text-gray-600">
              My Cash Out: <strong className="text-[#1e3a5f]">{formatLKRFull(result.myCashExposure)}</strong>
            </p>
            <p className={`text-sm font-semibold mt-0.5 ${result.isLoss ? 'text-red-600' : 'text-green-700'}`}>
              Net Profit Pool: {formatLKRFull(result.netProfitPool)}
            </p>
          </div>
        </div>

        <div className={`flex items-start gap-3 rounded-lg p-3 shadow-sm ${result.isLoss ? 'bg-red-50' : 'bg-green-50'}`}>
          <span className="text-lg">✂️</span>
          <div>
            <p className="text-xs font-bold text-gray-700">
              4. Split {profitSplitMyPercent}/{relativeSharePercent}
            </p>
            <p className={`text-sm font-semibold ${result.isLoss ? 'text-red-700' : 'text-green-700'}`}>
              My Share: {formatLKRFull(result.myShare)} {!result.isLoss && '✓'}
            </p>
            <p className="text-sm text-gray-600">
              {relativeName}&apos;s Share: {formatLKRFull(result.relativeShare)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {relativeName} receives total: {formatLKRFull(result.relativeTotalReceived)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
