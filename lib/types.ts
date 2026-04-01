export type FuelType = 'petrol' | 'diesel' | 'electric' | 'petrol_hybrid' | 'diesel_hybrid' | 'epower_hybrid' | 'plugin_hybrid'
export type VehicleCategory = 'car' | 'suv' | 'jeep' | 'pickup' | 'van'
export type Currency = 'JPY' | 'USD' | 'NZD'
export type ExciseType = 'per_cc' | 'percentage' | 'fixed'

export interface CalculatorState {
  // Import values
  fob: number
  insuranceFreight: number
  currency: Currency
  exchangeRate: number
  manufactureYear: number
  // Vehicle details
  vehicleName: string
  fuelType: FuelType
  engineCC: number
  hsCode: string
  category: VehicleCategory
  // Tax rates (all editable)
  customsDutyPercent: number
  surchargePercent: number
  exciseType: ExciseType
  dutyPerCC: number
  excisePercent: number
  exciseFixed: number
  vatPercent: number
  ssclPercent: number
  luxuryTaxPercent: number
  luxuryTaxThreshold: number
  // Local costs
  portCharges: number
  clearingFee: number
  registrationCost: number
  transport: number
  detailing: number
  advertising: number
  miscellaneous: number
  // Settlement
  expectedSellingPrice: number
  relativeOriginalCost: number
  profitSplitMyPercent: number
  mode: 'estimate' | 'actual'
  actualSellingPrice: number
}

export interface CalculationResult {
  cifLKR: number
  generalDuty: number
  exciseDuty: number
  luxuryTax: number
  sscl: number
  vat: number
  totalTax: number
  totalLocalCosts: number
  totalCalculation: number
  myCashExposure: number
  breakEvenPrice: number
  netProfitPool: number
  myShare: number
  relativeShare: number
  relativeTotalReceived: number
  profitMarginPercent: number
  myROI: number
  isLoss: boolean
}

export interface VehicleCardData {
  id: string
  name: string
  subtitle: string
  image: string
  fuelType: FuelType
  engineCC: number
  hsCode: string
  manufactureYear: number
  fob: number
  insuranceFreight: number
  currency: Currency
  exchangeRate: number
  expectedSellPriceLKR: number
  badgeColor: 'green' | 'yellow' | 'red'
  customsDutyPercent: number
  dutyPerCC: number
}
