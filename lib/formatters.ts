export function formatLKR(value: number): string {
  if (value === 0) return 'LKR 0'
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1000000) {
    return `${sign}LKR ${(abs / 1000000).toFixed(2)}M`
  }
  return `${sign}LKR ${abs.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`
}

export function formatLKRFull(value: number): string {
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  return `${sign}LKR ${abs.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-LK', { maximumFractionDigits: 0 })
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
