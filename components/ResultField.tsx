interface ResultFieldProps {
  label: string
  value: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'highlight' | 'positive' | 'negative' | 'total'
}

export default function ResultField({ label, value, size = 'md', variant = 'default' }: ResultFieldProps) {
  const bgClass = {
    default: 'bg-slate-800',
    highlight: 'bg-[#1e3a5f]',
    positive: 'bg-green-700',
    negative: 'bg-red-700',
    total: 'bg-[#0f2544]',
  }[variant]

  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-bold',
  }[size]

  return (
    <div className="mb-2">
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">{label}</p>
      <div className={`${bgClass} text-white rounded-lg px-4 py-2.5 ${textSize} font-mono tracking-wide`}>
        {value}
      </div>
    </div>
  )
}
