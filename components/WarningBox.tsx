export default function WarningBox() {
  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-3 py-2.5 mb-3 flex gap-2 items-start">
      <span className="text-base flex-shrink-0">⚠️</span>
      <p className="text-yellow-800 text-xs font-medium leading-snug">
        <strong>Estimates only.</strong> Actual duties may vary. Confirm with a licensed customs agent before decisions.
      </p>
    </div>
  )
}
