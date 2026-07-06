export default function FormActions({ onCancel, submitLabel, cancelLabel = 'Cancel', submitting, className = '' }) {
  return (
    <div className={`mt-2 flex flex-col gap-3 sm:flex-row ${className}`}>
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="flex-1 rounded-lg bg-blue-500 py-2 text-sm text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
      >
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </div>
  )
}
