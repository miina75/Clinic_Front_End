export default function FormField({ label, children, description, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      {children}
      {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
    </div>
  )
}
