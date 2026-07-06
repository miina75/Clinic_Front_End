export default function Input({ label, error, className = '', wrapperClassName = '', ...props }) {
  return (
    <div className={wrapperClassName}>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <input
        className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
