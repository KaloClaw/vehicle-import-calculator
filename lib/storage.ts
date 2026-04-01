import { CalculatorState } from './types'

const KEY = 'yathra_calc_state'

export function saveState(state: CalculatorState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore storage errors
  }
}

export function loadState(): CalculatorState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as CalculatorState
  } catch {
    return null
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
