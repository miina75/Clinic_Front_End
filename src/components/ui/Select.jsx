export default function Select({ label, children, error, className = '', wrapperClassName = '', ...props }) {
  return (
    <div className={wrapperClassName}>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <select
        className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
