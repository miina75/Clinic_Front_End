export default function Button({ type = 'button', variant = 'primary', size = 'md', children, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-150'
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  }
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-50 text-red-500 hover:bg-red-100',
    ghost: 'text-gray-500 hover:bg-gray-100',
  }

  return (
    <button type={type} className={`${base} ${sizes[size] ?? sizes.md} ${variants[variant] ?? variants.primary} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}
