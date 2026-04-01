import { CalculatorState, CalculationResult } from './types'

export function calculate(state: CalculatorState): CalculationResult {
  const safe = (n: number) => (isNaN(n) || !isFinite(n) ? 0 : n)

  // 1. CIF
  const cifLKR = safe((state.fob + state.insuranceFreight) * state.exchangeRate)

  // 2. General duty (customs duty)
  const generalDuty = safe(cifLKR * (state.customsDutyPercent / 100))

  // 3. Excise duty
  let exciseDuty = 0
  if (state.exciseType === 'per_cc') exciseDuty = safe(state.engineCC * state.dutyPerCC)
  else if (state.exciseType === 'percentage') exciseDuty = safe(cifLKR * (state.excisePercent / 100))
  else exciseDuty = safe(state.exciseFixed)

  // 4. Luxury tax
  const luxuryBase = Math.max(0, cifLKR - state.luxuryTaxThreshold)
  const luxuryTax = safe(luxuryBase * (state.luxuryTaxPercent / 100))

  // 5. SSCL (base = CIF)
  const sscl = safe(cifLKR * (state.ssclPercent / 100))

  // 6. VAT
  const vatBase = cifLKR + generalDuty + exciseDuty + luxuryTax + sscl
  const vat = safe(vatBase * (state.vatPercent / 100))

  // 7. Total tax
  const totalTax = generalDuty + exciseDuty + luxuryTax + sscl + vat

  // 8. Local costs
  const totalLocalCosts =
    state.portCharges +
    state.clearingFee +
    state.registrationCost +
    state.transport +
    state.detailing +
    state.advertising +
    state.miscellaneous

  // 9. Total calculation (full cost)
  const totalCalculation = cifLKR + totalTax + totalLocalCosts

  // 10. My cash exposure (only Sri Lanka side)
  const myCashExposure = totalTax + totalLocalCosts

  // 11. Break-even
  const breakEvenPrice = state.relativeOriginalCost + myCashExposure

  // 12. Settlement using expected or actual price
  const salePrice =
    state.mode === 'actual' ? state.actualSellingPrice : state.expectedSellingPrice
  const netProfitPool = salePrice - state.relativeOriginalCost - myCashExposure
  const myShare = safe(netProfitPool * (state.profitSplitMyPercent / 100))
  const relativeSharePercent = 100 - state.profitSplitMyPercent
  const relativeShare = safe(netProfitPool * (relativeSharePercent / 100))
  const relativeTotalReceived = state.relativeOriginalCost + relativeShare
  const profitMarginPercent = salePrice > 0 ? safe((myShare / salePrice) * 100) : 0
  const myROI = myCashExposure > 0 ? safe((myShare / myCashExposure) * 100) : 0

  return {
    cifLKR,
    generalDuty,
    exciseDuty,
    luxuryTax,
    sscl,
    vat,
    totalTax,
    totalLocalCosts,
    totalCalculation,
    myCashExposure,
    breakEvenPrice,
    netProfitPool,
    myShare,
    relativeShare,
    relativeTotalReceived,
    profitMarginPercent,
    myROI,
    isLoss: netProfitPool < 0,
  }
}
